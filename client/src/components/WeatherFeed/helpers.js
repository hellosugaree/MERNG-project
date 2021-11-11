export const generateHazardLabel = (phenomenonCode, significanceCode) => {
  // decode the hazard phenmonen and significance keys according to NOAA codes https://www.weather.gov/bmx/vtec
  // return a string label eg "Small Craft Advisory"

  let hazardLongName = ''; 
  let significanceLongName = '';
  switch (phenomenonCode) {
    case 'BZ': 
      hazardLongName = 'Blizzard';
      break;
    case 'WS': 
      hazardLongName = 'Winter Storm';
      break;
    case 'WW Winter Weather': 
      hazardLongName = 'undefined';
      break;
    case 'SN': 
      hazardLongName = 'Snow';
      break;
    case 'HS': 
      hazardLongName = 'Heavy Snow';
      break;
    case 'LE': 
      hazardLongName = 'Lake Effect Snow';
      break;
    case 'LB': 
      hazardLongName = 'Lake Effect Snow & Blowing Snow';
      break;
    case 'BS': 
      hazardLongName = 'Blowing/Drifting Snow';
      break;
    case 'SB': 
      hazardLongName = 'Snow & Blowing Snow';
      break;
    case 'IP': 
      hazardLongName = 'Sleet';
      break;
    case 'HP': 
      hazardLongName = 'Heavy Sleet';
      break;
    case 'ZR': 
      hazardLongName = 'Freezing Rain';
      break;
    case 'IS': 
      hazardLongName = 'Ice Storm';
      break;
    case 'FZ': 
      hazardLongName = 'Freeze';
      break;
    case 'ZF': 
      hazardLongName = 'Freezing Fog';
      break;
    case 'FR': 
      hazardLongName = 'Frost';
      break;
    case 'WC': 
      hazardLongName = 'Wind Chill';
      break;
    case 'EC': 
      hazardLongName = 'Extreme Cold';
      break;
    case 'WI': 
      hazardLongName = 'Wind';
      break;
    case 'HW': 
      hazardLongName = 'High Wind';
      break;
    case 'LW': 
      hazardLongName = 'Lake Wind';
      break;
    case 'FG': 
      hazardLongName = 'Dense Fog';
      break;
    case 'SM': 
      hazardLongName = 'Dense Smoke';
      break;
    case 'HT': 
      hazardLongName = 'Heat';
      break;
    case 'EH': 
      hazardLongName = 'Excessive Heat';
      break;
    case 'DU': 
      hazardLongName = 'Blowing Dust';
      break;
    case 'DS': 
      hazardLongName = 'Dust Storm';
      break;
    case 'FL': 
      hazardLongName = 'Flood';
      break;
    case 'FF': 
      hazardLongName = 'Flash Flood';
      break;
    case 'SV': 
      hazardLongName = 'Severe Thunderstorm';
      break;
    case 'TO': 
      hazardLongName = 'Tornado';
      break;
    case 'FW': 
      hazardLongName = 'Fire Weather';
      break;
    case 'RH': 
      hazardLongName = 'Radiological Hazard';
      break;
    case 'VO': 
      hazardLongName = 'Volcano';
      break;
    case 'AF': 
      hazardLongName = 'Volcanic Ashfall';
      break;
    case 'AS': 
      hazardLongName = 'Air Stagnation';
      break;
    case 'AV': 
      hazardLongName = 'Avalanche';
      break;
    case 'TS': 
      hazardLongName = 'Tsunami';
      break;
    case 'MA': 
      hazardLongName = 'Marine';
      break;
    case 'SC': 
      hazardLongName = 'Small Craft';
      break;
    case 'GL': 
      hazardLongName = 'Gale';
      break;
    case 'SR': 
      hazardLongName = 'Storm';
      break;
    case 'HF': 
      hazardLongName = 'Hurricane Force Wind';
      break;
    case 'TR': 
      hazardLongName = 'Tropical Storm';
      break;
    case 'HU': 
      hazardLongName = 'Hurricane';
      break;
    case 'TY': 
      hazardLongName = 'Typhoon';
      break;
    case 'TI': 
      hazardLongName = 'Inland Tropical Storm Wind';
      break;
    case 'HI': 
      hazardLongName = 'Inland Hurricane Wind';
      break;
    case 'LS': 
      hazardLongName = 'Lakeshore Flood';
      break;
    case 'CF': 
      hazardLongName = 'Coastal Flood';
      break;
    case 'UP': 
      hazardLongName = 'Ice Accretion';
      break;
    case 'LO': 
      hazardLongName = 'Low Water';
      break;
    case 'SU': 
      hazardLongName = 'High Surf';
      break;
    default:
      hazardLongName = 'Unknown Hazard';
      break;
  }

  // decode signficance
  switch (significanceCode) {
    case 'W': 
      significanceLongName = 'Warning';
      break;
    case 'A': 
      significanceLongName = 'Watch';
      break;
    case 'Y': 
      significanceLongName = 'Advisory';
      break;
    case 'S': 
      significanceLongName = 'Statement';
      break; 
    default: 
      significanceLongName = '';                       
  }
  
  return hazardLongName + ' ' + significanceLongName;
};
