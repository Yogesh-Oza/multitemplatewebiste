export interface RoadsLightingSnapshotData {
  id?: string;
  sectionTitle: string;
  sectionTitleEn: string;
  sectionSubtitle: string;
  sectionSubtitleEn: string;
  roadsInfoTitle: string;
  roadsInfoTitleEn: string;
  roadsTotalLength: number;
  roadsPavedLength: number;
  roadsUnpavedLength: number;
  roadsCondition: string;
  roadsConditionEn: string;
  roadsLastMaintenance: string;
  roadsUpcomingWork: string[];
  lightingInfoTitle: string;
  lightingInfoTitleEn: string;
  lightingTotalLights: number;
  lightingFunctionalLights: number;
  lightingLedLights: number;
  lightingTraditionalLights: number;
  lightingWorkingHours: string;
  lightingLastMaintenance: string;
  lightingEnergySource: string;
  lightingEnergySourceEn: string;
  issueTitle: string;
  issueTitleEn: string;
  issueDescription: string;
  issueDescriptionEn: string;
  issueContactLabel: string;
  issueContactLabelEn: string;
  issueContactNumber: string;
  issueActionLabel: string;
  issueActionLabelEn: string;
  issueActionLabel2?: string;
  issueActionLabel2En?: string;
  isActive?: boolean;
}

export interface RoadsLightingFacilityData {
  id?: string;
  title: string;
  titleEn: string;
  type: string; // road, bridge, streetlight, traffic
  status: string; // operational, maintenance, non-functional
  statusEn: string;
  location: string;
  locationEn: string;
  length?: string;
  capacity?: string;
  lastMaintenance: string;
  contactNumber: string;
  contactLabel: string;
  contactLabelEn: string;
  actionLabel: string;
  actionLabelEn: string;
  order: number;
  isActive: boolean;
}

export interface RoadsLightingApiResponse {
  snapshot: RoadsLightingSnapshotData;
  facilities: RoadsLightingFacilityData[];
  isDemo: boolean;
}

export const roadsLightingDemoSnapshot: RoadsLightingSnapshotData = {
  sectionTitle: 'रस्ते आणि रस्त्यावरील दिवे',
  sectionTitleEn: 'Roads & Street Lighting',
  sectionSubtitle: 'गावातील रस्ते, पुल, स्ट्रीट लाइट्स आणि वाहतूक व्यवस्था',
  sectionSubtitleEn: 'Village roads, bridges, street lights and traffic management',
  roadsInfoTitle: 'रस्ते माहिती',
  roadsInfoTitleEn: 'Roads Information',
  roadsTotalLength: 25.5,
  roadsPavedLength: 20.2,
  roadsUnpavedLength: 5.3,
  roadsCondition: 'चांगले',
  roadsConditionEn: 'Good',
  roadsLastMaintenance: 'अद्यतन: १५/११/२०२४',
  roadsUpcomingWork: [
    'मुख्य रस्त्याची दुरुस्ती',
    'नवीन स्ट्रीट लाइट्स स्थापना',
    'पुलाची मरम्मत'
  ],
  lightingInfoTitle: 'स्ट्रीट लाइटिंग माहिती',
  lightingInfoTitleEn: 'Street Lighting Information',
  lightingTotalLights: 180,
  lightingFunctionalLights: 165,
  lightingLedLights: 120,
  lightingTraditionalLights: 60,
  lightingWorkingHours: '6:00 PM - 6:00 AM',
  lightingLastMaintenance: 'अद्यतन: २०/११/२०२४',
  lightingEnergySource: 'हायब्रीड',
  lightingEnergySourceEn: 'Hybrid',
  issueTitle: 'रस्ते आणि दिवे समस्या',
  issueTitleEn: 'Roads & Lighting Issues',
  issueDescription: 'रस्ते, पुल किंवा स्ट्रीट लाइट्स संबंधित कोणतीही समस्या असल्यास ताबडतोब संपर्क करा',
  issueDescriptionEn: 'Contact immediately for any roads, bridges or street lights related issue',
  issueContactLabel: 'तातडीचा संपर्क',
  issueContactLabelEn: 'Emergency Contact',
  issueContactNumber: '+91-XXXX-XXXXXX',
  issueActionLabel: 'तातडीचा संपर्क',
  issueActionLabelEn: 'Emergency Contact',
  issueActionLabel2: 'तक्रार नोंदवा',
  issueActionLabel2En: 'Report Issue',
  isActive: true
};

export const roadsLightingDemoFacilities: RoadsLightingFacilityData[] = [
  {
    id: 'demo-road-1',
    title: 'मुख्य रस्ता',
    titleEn: 'Main Road',
    type: 'road',
    status: 'चालू',
    statusEn: 'Operational',
    location: 'गावाच्या मध्यभागातून जाणारा',
    locationEn: 'Passing through the center of the village',
    length: '3.2 किमी',
    lastMaintenance: 'अद्यतन: १५/११/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    order: 0,
    isActive: true
  },
  {
    id: 'demo-bridge-1',
    title: 'पुल',
    titleEn: 'Bridge',
    type: 'bridge',
    status: 'देखभाल',
    statusEn: 'Under Maintenance',
    location: 'नदीवरचा पुल',
    locationEn: 'Bridge over the river',
    capacity: '10 टन',
    lastMaintenance: 'अद्यतन: १/१२/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    order: 1,
    isActive: true
  },
  {
    id: 'demo-light-1',
    title: 'स्ट्रीट लाइट्स',
    titleEn: 'Street Lights',
    type: 'streetlight',
    status: 'चालू',
    statusEn: 'Operational',
    location: 'मुख्य रस्त्यावर',
    locationEn: 'On main road',
    capacity: '50 लाइट्स',
    lastMaintenance: 'अद्यतन: २०/११/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    order: 2,
    isActive: true
  },
  {
    id: 'demo-traffic-1',
    title: 'ट्रॅफिक सिग्नल',
    titleEn: 'Traffic Signal',
    type: 'traffic',
    status: 'चालू',
    statusEn: 'Operational',
    location: 'चौकात',
    locationEn: 'At the square',
    lastMaintenance: 'अद्यतन: २५/११/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    order: 3,
    isActive: true
  }
];

