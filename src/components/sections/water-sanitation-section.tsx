'use client';

import { useEffect, useState } from 'react';
import { Droplets, ShieldCheck, Recycle, MapPin, Phone, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  waterSanitationDemoSnapshot,
  waterSanitationDemoFacilities,
  WaterSanitationApiResponse
} from '@/lib/demo-water-sanitation';

export function WaterSanitationSection() {
  const [data, setData] = useState<WaterSanitationApiResponse>({
    snapshot: waterSanitationDemoSnapshot,
    facilities: waterSanitationDemoFacilities,
    isDemo: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/water-sanitation');
        if (response.ok) {
          const payload = await response.json();
          setData({
            snapshot: payload.snapshot || waterSanitationDemoSnapshot,
            facilities: payload.facilities?.length ? payload.facilities : waterSanitationDemoFacilities,
            isDemo: Boolean(payload.isDemo)
          });
        } else {
          setError('माहिती लोड करण्यात अडचण आली');
        }
      } catch (err) {
        console.error(err);
        setError('माहिती लोड करण्यात अडचण आली');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="container mx-auto flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="container mx-auto text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  const { snapshot, facilities, isDemo } = data;
  const connectionPercent =
    snapshot.waterConnectionsTotal > 0
      ? Math.round((snapshot.waterConnectionsActive / snapshot.waterConnectionsTotal) * 100)
      : 0;

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-emerald-50">
      <div className="container mx-auto space-y-12">
        <div className="text-center space-y-4">
          <p className="text-sm font-semibold text-blue-600">Water & Sanitation</p>
          <h2 className="text-4xl font-bold text-gray-900">{snapshot.sectionTitle}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">{snapshot.sectionSubtitle}</p>
          {isDemo && (
            <p className="text-xs text-blue-600 bg-white/80 px-3 py-1 inline-flex rounded-full border border-blue-100">
              डेमो डेटा - प्रशासनामधून अपडेट करा
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur">
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>{snapshot.waterInfoTitle}</CardTitle>
                <CardDescription>{snapshot.waterInfoTitleEn}</CardDescription>
              </div>
              <Droplets className="h-10 w-10 text-blue-500" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">कार्यरत कनेक्शन</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {snapshot.waterConnectionsActive} / {snapshot.waterConnectionsTotal}
                    </p>
                  </div>
                  <Badge>{connectionPercent}%</Badge>
                </div>
                <Progress value={connectionPercent} className="mt-3" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-blue-600 uppercase">{snapshot.waterSupplyDurationLabel}</p>
                  <p className="text-2xl font-bold text-gray-900">{snapshot.waterSupplyDuration}</p>
                  <p className="text-sm text-gray-600">{snapshot.waterSupplyFrequency}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-emerald-600 uppercase">{snapshot.waterStorageCapacityLabel}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {snapshot.waterStorageCapacityValue} {snapshot.waterStorageCapacityUnit}
                  </p>
                  <p className="text-sm text-gray-600">{snapshot.waterStorageCapacityLabelEn}</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-indigo-600 uppercase">पाणी गुणवत्ता</p>
                  <p className="text-2xl font-bold text-gray-900">{snapshot.waterQualityStatus}</p>
                  <p className="text-sm text-gray-600">{snapshot.waterQualityUpdatedOn}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur">
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>{snapshot.sanitationInfoTitle}</CardTitle>
                <CardDescription>{snapshot.sanitationInfoTitleEn}</CardDescription>
              </div>
              <ShieldCheck className="h-10 w-10 text-emerald-500" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">कार्यरत</p>
                  <p className="text-3xl font-bold">{snapshot.sanitationFunctionalToilets}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">एकूण</p>
                  <p className="text-3xl font-bold">{snapshot.sanitationTotalToilets}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{snapshot.sanitationPublicToiletsLabel}</p>
                  <p className="text-3xl font-bold">{snapshot.sanitationPublicToilets}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Recycle className="h-5 w-5 text-green-600" />
                  <p className="text-gray-700">{snapshot.wasteCollectionStatus}</p>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  <p className="text-gray-700">{snapshot.drainageStatus}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets className="h-5 w-5 text-indigo-600" />
                  <p className="text-gray-700">{snapshot.waterTreatmentStatus}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {facilities
            .filter((facility) => facility.isActive)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((facility) => (
              <Card key={facility.id || facility.title} className="bg-white/90 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{facility.title}</CardTitle>
                    <Badge variant={facility.statusEn === 'Under Maintenance' ? 'secondary' : 'default'}>
                      {facility.status}
                    </Badge>
                  </div>
                  <CardDescription>{facility.titleEn}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-500" />
                    {facility.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    {facility.capacity}
                  </div>
                  <p className="text-xs text-gray-500">{facility.updatedOn}</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    {facility.contactNumber}
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <a href={`tel:${facility.contactNumber.replace(/[^0-9+]/g, '')}`}>
                      {facility.actionLabel}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
          <CardHeader>
            <CardTitle>{snapshot.issueTitle}</CardTitle>
            <CardDescription className="text-blue-50">{snapshot.issueTitleEn}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-lg">{snapshot.issueDescription}</p>
              <p className="text-sm text-blue-100">{snapshot.issueDescriptionEn}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-sm uppercase tracking-wide text-blue-100">{snapshot.issueContactLabel}</p>
              <p className="text-2xl font-bold">{snapshot.issueContactNumber}</p>
              <Button
                asChild
                className="mt-3 bg-white text-blue-700 hover:bg-blue-50"
              >
                <a href={`tel:${snapshot.issueContactNumber.replace(/[^0-9+]/g, '')}`}>
                  {snapshot.issueActionLabel}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
