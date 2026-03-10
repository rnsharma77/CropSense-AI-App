// Plant disease detection service using Plant.id API
// Required: set `REACT_APP_PLANT_ID_API_KEY` in your .env file
// Get your API key from: https://plant.id/
const PLANT_ID_BASE = 'https://plant.id/api/v3';
const PLANT_ID_API_KEY = process.env.REACT_APP_PLANT_ID_API_KEY;
const API_SERVER = process.env.REACT_APP_API_SERVER || 'http://localhost:5050';

// Save a brief analysis summary to the backend server which persists to MongoDB.
export const saveAnalysisSummary = async (summary) => {
  try {
    if (!API_SERVER) {
      console.warn('API_SERVER not configured, skipping save');
      return null;
    }

    const endpoint = `${API_SERVER}/api/analysis`;
    console.log('Saving analysis to:', endpoint);
    console.log('Summary data:', summary);
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(summary),
    });
    
    console.log('Save response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`HTTP ${res.status}: ${errorText}`);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('✓ Analysis saved successfully to MongoDB:', data);
    return data;
  } catch (err) {
    console.error('❌ Failed to save analysis summary:', err.message || err);
    // Don't throw - let the analysis still complete even if saving fails
    return null;
  }
};

export const analyzeDisease = async (imageBase64) => {
  // Validate API key is set
  if (!PLANT_ID_API_KEY || PLANT_ID_API_KEY.trim() === '') {
    throw new Error('Plant.id API key not configured. Please add REACT_APP_PLANT_ID_API_KEY to your .env file.');
  }

  // Validate image data
  if (!imageBase64 || imageBase64.trim() === '') {
    throw new Error('Image data is empty or invalid.');
  }

  console.log('Sending request to Plant.id API with image size:', imageBase64.length);

  try {
    const payload = {
      images: [imageBase64],
      health: 'all',
      disease_model: 'full',
      similar_images: true,
      symptoms: true,
    };

    console.log('API Payload:', { ...payload, images: ['[base64-image]'] });

    const response = await fetch(`${PLANT_ID_BASE}/health_assessment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': PLANT_ID_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Plant.id API returned non-JSON response:', text);
      throw new Error(`API Error (${response.status}): ${text.substring(0, 100)}`);
    }

    if (!response.ok) {
      console.error('Plant.id API Error Response:', data);
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    console.log('✓ Plant.id API Response received');
    console.log('Full API Response:', JSON.stringify(data, null, 2));

    // Parse response using correct structure from Plant.id v3 API
    const isHealthy = data.result?.is_healthy?.binary || false;
    const diseases  = data.result?.disease?.suggestions || [];
    
    console.log('Parsed data:');
    console.log('  - isHealthy:', isHealthy);
    console.log('  - diseases count:', diseases.length);
    console.log('  - diseases:', diseases.map(d => ({ name: d.name, probability: d.probability })));

    if (isHealthy) {
      // Plant is healthy
      console.log('✓ Plant detected as HEALTHY');
      await saveAnalysisSummary({
        summary: 'Plant is healthy',
        disease: null,
        confidence: data.result?.is_healthy?.probability || 0.95,
        plantInfo: { name: 'Healthy Plant', commonName: 'Plant', isHealthy: true },
        isDemo: false,
        meta: { source: 'client' },
      });

      return {
        success:    true,
        isHealthy:  true,   // ← TOP LEVEL — ResultPage destructures this directly
        disease:    null,
        confidence: data.result?.is_healthy?.probability || 0.95,
        plantInfo:  { name: 'Healthy Plant', commonName: 'Plant' },
      };
    }

    if (diseases.length === 0) {
      // No diseases detected but not marked as healthy
      console.log('⚠️ No diseases detected');
      await saveAnalysisSummary({
        summary: 'No disease detected',
        disease: null,
        confidence: 0,
        plantInfo: { name: 'Unknown Plant', commonName: 'Plant', isHealthy: true },
        isDemo: false,
        meta: { source: 'client' },
      });

      return {
        success:    true,
        isHealthy:  true,   // ← treat as healthy so ResultPage shows healthy screen
        disease:    null,
        confidence: 0,
        plantInfo:  { name: 'Unknown Plant', commonName: 'Plant' },
      };
    }

    // Disease detected
    console.log('✓ Disease detected:', diseases[0].name, `(${(diseases[0].probability * 100).toFixed(1)}%)`);
    const topDisease = diseases[0];
    const formattedDisease = {
      name:          topDisease.name,
      probability:   topDisease.probability,
      description:   topDisease.details?.description || `${topDisease.name} detected on plant.`,
      treatment:     topDisease.details?.treatment?.chemical   || ['Consult local agronomist for treatment plan'],
      organic:       topDisease.details?.treatment?.biological || ['Apply neem oil as organic treatment'],
      severity:      topDisease.probability > 0.7 ? 'High' : topDisease.probability > 0.4 ? 'Medium' : 'Low',
      severityScore: Math.round(topDisease.probability * 100),
      // FIX: these two fields are used by ResultPage — map from v3 API fields
      affectedCrops: topDisease.details?.host  || [],
      seasonalRisk:  topDisease.details?.cause || '',
      color:         topDisease.probability > 0.7 ? '#ff5757' : topDisease.probability > 0.4 ? '#f5e642' : '#3dffa0',
    };

    const resultObj = {
      success:     true,
      isHealthy:   false,  // ← TOP LEVEL — ResultPage destructures this directly
      isDemo:      false,
      disease:     formattedDisease,
      allDetected: diseases.slice(0, 3).map(d => ({
        name:          d.name,
        probability:   d.probability,
        severityScore: Math.round(d.probability * 100),
        color:         d.probability > 0.7 ? '#ff5757' : d.probability > 0.4 ? '#f5e642' : '#3dffa0',
      })),
      confidence:  topDisease.probability,
      plantInfo:   { name: 'Detected Plant', commonName: 'Plant', isHealthy: false },
    };

    // Save disease analysis to backend
    await saveAnalysisSummary({
      summary:    `${formattedDisease.name} (${formattedDisease.severityScore}%)`,
      disease:    formattedDisease.name,
      confidence: formattedDisease.probability,
      plantInfo:  resultObj.plantInfo,
      isDemo:     false,
      meta:       { source: 'client' },
    });

    return resultObj;

  } catch (error) {
    console.error('Plant.id API Error:', error.message);
    throw new Error(error.message || 'Failed to analyze image. Please check your API key and try again.');
  }
};

export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};