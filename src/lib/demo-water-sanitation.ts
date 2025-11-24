export interface WaterSanitationSnapshotData {
  id?: string;
  sectionTitle: string;
  sectionTitleEn: string;
  sectionSubtitle: string;
  sectionSubtitleEn: string;
  waterInfoTitle: string;
  waterInfoTitleEn: string;
  waterConnectionsActive: number;
  waterConnectionsTotal: number;
  waterSupplyDuration: string;
  waterSupplyDurationLabel: string;
  waterSupplyDurationLabelEn: string;
  waterSupplyFrequency: string;
  waterSupplyFrequencyEn: string;
  waterStorageCapacityValue: string;
  waterStorageCapacityUnit: string;
  waterStorageCapacityLabel: string;
  waterStorageCapacityLabelEn: string;
  waterQualityStatus: string;
  waterQualityStatusEn: string;
  waterQualityUpdatedOn: string;
  sanitationInfoTitle: string;
  sanitationInfoTitleEn: string;
  sanitationFunctionalToilets: number;
  sanitationTotalToilets: number;
  sanitationPublicToilets: number;
  sanitationPublicToiletsLabel: string;
  sanitationPublicToiletsLabelEn: string;
  wasteCollectionStatus: string;
  wasteCollectionStatusEn: string;
  drainageStatus: string;
  drainageStatusEn: string;
  waterTreatmentStatus: string;
  waterTreatmentStatusEn: string;
  issueTitle: string;
  issueTitleEn: string;
  issueDescription: string;
  issueDescriptionEn: string;
  emergencyTitle: string;
  emergencyTitleEn: string;
  issueContactLabel: string;
  issueContactLabelEn: string;
  issueContactNumber: string;
  issueActionLabel: string;
  issueActionLabelEn: string;
  isActive?: boolean;
}

export interface WaterSanitationFacilityData {
  id?: string;
  title: string;
  titleEn: string;
  category: string;
  status: string;
  statusEn: string;
  location: string;
  locationEn: string;
  capacity: string;
  capacityEn: string;
  updatedOn: string;
  contactNumber: string;
  contactLabel: string;
  contactLabelEn: string;
  actionLabel: string;
  actionLabelEn: string;
  order: number;
  isActive: boolean;
}

export interface WaterSanitationApiResponse {
  snapshot: WaterSanitationSnapshotData;
  facilities: WaterSanitationFacilityData[];
  isDemo: boolean;
}

export const waterSanitationDemoSnapshot: WaterSanitationSnapshotData = {
  sectionTitle: 'पाणीपुरवठा आणि स्वच्छता',
  sectionTitleEn: 'Water Supply & Sanitation',
  sectionSubtitle: 'गावातील पाणीपुरवठा, स्वच्छता सुविधा आणि कचरा व्यवस्थापन',
  sectionSubtitleEn: 'Village water supply, sanitation facilities and waste management overview',
  waterInfoTitle: 'पाणीपुरवठा माहिती',
  waterInfoTitleEn: 'Water Supply Information',
  waterConnectionsActive: 420,
  waterConnectionsTotal: 450,
  waterSupplyDuration: '24 hours',
  waterSupplyDurationLabel: 'दैनिक पुरवठा',
  waterSupplyDurationLabelEn: 'Daily Supply',
  waterSupplyFrequency: 'प्रति दिवस',
  waterSupplyFrequencyEn: 'Per Day',
  waterStorageCapacityValue: '50,000',
  waterStorageCapacityUnit: 'liters',
  waterStorageCapacityLabel: 'साठवण क्षमता',
  waterStorageCapacityLabelEn: 'Storage Capacity',
  waterQualityStatus: 'चांगले',
  waterQualityStatusEn: 'Good',
  waterQualityUpdatedOn: 'अद्यतन: १/१२/२०२४',
  sanitationInfoTitle: 'स्वच्छता माहिती',
  sanitationInfoTitleEn: 'Sanitation Information',
  sanitationFunctionalToilets: 365,
  sanitationTotalToilets: 380,
  sanitationPublicToilets: 12,
  sanitationPublicToiletsLabel: 'सार्वजनिक शौचालये',
  sanitationPublicToiletsLabelEn: 'Public Toilets',
  wasteCollectionStatus: 'कचरा संकलन: सक्रिय',
  wasteCollectionStatusEn: 'Waste Collection: Active',
  drainageStatus: 'निकासी व्यवस्था उपलब्ध',
  drainageStatusEn: 'Drainage System Available',
  waterTreatmentStatus: 'पाणी शोधन केंद्र कार्यरत',
  waterTreatmentStatusEn: 'Water Treatment Plant Operational',
  issueTitle: 'पाणी आणि स्वच्छता समस्या',
  issueTitleEn: 'Water & Sanitation Issues',
  issueDescription: 'पाणीपुरवठा किंवा स्वच्छता संबंधित कोणतीही समस्या असल्यास ताबडतोब संपर्क करा',
  issueDescriptionEn: 'Contact immediately for any water or sanitation related issue',
  emergencyTitle: 'तातडीचा संपर्क',
  emergencyTitleEn: 'Emergency Contact',
  issueContactLabel: 'संपर्क माहिती',
  issueContactLabelEn: 'Contact Information',
  issueContactNumber: '+91-XXXX-XXXXXX',
  issueActionLabel: 'तक्रार नोंदवा',
  issueActionLabelEn: 'Report Issue'
};

export const waterSanitationDemoFacilities: WaterSanitationFacilityData[] = [
  {
    id: 'demo-plant',
    title: 'पाणी शोधन केंद्र',
    titleEn: 'Water Treatment Plant',
    category: 'Water Infrastructure',
    status: 'चालू',
    statusEn: 'Operational',
    location: 'गावाच्या पूर्व भागात',
    locationEn: 'Eastern part of the village',
    capacity: 'क्षमता: 25,000 लिटर/दिवस',
    capacityEn: 'Capacity: 25,000 liters/day',
    updatedOn: 'अद्यतन: १५/११/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    order: 0,
    isActive: true
  },
  {
    id: 'demo-tank',
    title: 'पाणी टाकी',
    titleEn: 'Water Tank',
    category: 'Water Storage',
    status: 'चालू',
    statusEn: 'Operational',
    location: 'ग्रामपंचायत कार्यालयजवळ',
    locationEn: 'Near Gram Panchayat office',
    capacity: 'क्षमता: 50,000 लिटर',
    capacityEn: 'Capacity: 50,000 liters',
    updatedOn: 'अद्यतन: २०/११/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    order: 1,
    isActive: true
  },
  {
    id: 'demo-sanitation',
    title: 'स्वच्छता केंद्र',
    titleEn: 'Sanitation Center',
    category: 'Sanitation',
    status: 'चालू',
    statusEn: 'Operational',
    location: 'गावाच्या मध्य भागात',
    locationEn: 'Central part of the village',
    capacity: 'क्षमता: 100 कुटुंबे',
    capacityEn: 'Capacity: 100 families',
    updatedOn: 'अद्यतन: २५/११/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    order: 2,
    isActive: true
  },
  {
    id: 'demo-waste',
    title: 'कचरा प्रक्रिया केंद्र',
    titleEn: 'Waste Processing Center',
    category: 'Waste Management',
    status: 'देखभाल',
    statusEn: 'Under Maintenance',
    location: 'गावाच्या पश्चिम भागात',
    locationEn: 'Western part of the village',
    capacity: 'क्षमता: 500 किलो/दिवस',
    capacityEn: 'Capacity: 500 kg/day',
    updatedOn: 'अद्यतन: १/१२/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    order: 3,
    isActive: true
  }
];

