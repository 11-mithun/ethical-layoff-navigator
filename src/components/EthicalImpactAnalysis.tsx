
import React from 'react';
import { PredictionResult } from '@/services/mlService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EthicalImpactAnalysisProps {
  results: PredictionResult[];
}

const EthicalImpactAnalysis: React.FC<EthicalImpactAnalysisProps> = ({ results }) => {
  // Calculate distributions by department, gender, age group
  const departmentEthics = React.useMemo(() => {
    const deptMap: Record<string, {
      fairness: number[],
      transparency: number[],
      morals: number[],
      bias: number[]
    }> = {};
    
    results.forEach(result => {
      const dept = result.employee.department;
      if (!deptMap[dept]) {
        deptMap[dept] = {
          fairness: [],
          transparency: [],
          morals: [],
          bias: []
        };
      }
      
      deptMap[dept].fairness.push(result.ethicalMetrics.fairness);
      deptMap[dept].transparency.push(result.ethicalMetrics.transparency);
      deptMap[dept].morals.push(result.ethicalMetrics.morals);
      deptMap[dept].bias.push(result.ethicalMetrics.bias);
    });
    
    return Object.entries(deptMap).map(([dept, metrics]) => ({
      name: dept,
      fairness: metrics.fairness.reduce((a, b) => a + b, 0) / metrics.fairness.length,
      transparency: metrics.transparency.reduce((a, b) => a + b, 0) / metrics.transparency.length,
      morals: metrics.morals.reduce((a, b) => a + b, 0) / metrics.morals.length,
      bias: metrics.bias.reduce((a, b) => a + b, 0) / metrics.bias.length,
    }));
  }, [results]);
  
  const genderEthics = React.useMemo(() => {
    const genderMap: Record<string, {
      fairness: number[],
      transparency: number[],
      morals: number[],
      bias: number[],
      layoffCount: number,
      totalCount: number
    }> = {};
    
    results.forEach(result => {
      const gender = result.employee.gender;
      if (!genderMap[gender]) {
        genderMap[gender] = {
          fairness: [],
          transparency: [],
          morals: [],
          bias: [],
          layoffCount: 0,
          totalCount: 0
        };
      }
      
      genderMap[gender].fairness.push(result.ethicalMetrics.fairness);
      genderMap[gender].transparency.push(result.ethicalMetrics.transparency);
      genderMap[gender].morals.push(result.ethicalMetrics.morals);
      genderMap[gender].bias.push(result.ethicalMetrics.bias);
      genderMap[gender].totalCount++;
      if (result.prediction === 'layoff') {
        genderMap[gender].layoffCount++;
      }
    });
    
    return Object.entries(genderMap).map(([gender, metrics]) => ({
      name: gender,
      fairness: metrics.fairness.reduce((a, b) => a + b, 0) / metrics.fairness.length,
      transparency: metrics.transparency.reduce((a, b) => a + b, 0) / metrics.transparency.length,
      morals: metrics.morals.reduce((a, b) => a + b, 0) / metrics.morals.length,
      bias: metrics.bias.reduce((a, b) => a + b, 0) / metrics.bias.length,
      layoffRate: (metrics.layoffCount / metrics.totalCount) * 100,
      layoffCount: metrics.layoffCount,
      totalCount: metrics.totalCount
    }));
  }, [results]);
  
  // Age groups
  const ageEthics = React.useMemo(() => {
    // Create age buckets
    const ageBuckets: Record<string, {
      fairness: number[],
      transparency: number[],
      morals: number[],
      bias: number[],
      layoffCount: number,
      totalCount: number
    }> = {
      '20-29': { fairness: [], transparency: [], morals: [], bias: [], layoffCount: 0, totalCount: 0 },
      '30-39': { fairness: [], transparency: [], morals: [], bias: [], layoffCount: 0, totalCount: 0 },
      '40-49': { fairness: [], transparency: [], morals: [], bias: [], layoffCount: 0, totalCount: 0 },
      '50+': { fairness: [], transparency: [], morals: [], bias: [], layoffCount: 0, totalCount: 0 },
    };
    
    results.forEach(result => {
      const age = result.employee.age;
      let bucket;
      
      if (age < 30) bucket = '20-29';
      else if (age < 40) bucket = '30-39';
      else if (age < 50) bucket = '40-49';
      else bucket = '50+';
      
      ageBuckets[bucket].fairness.push(result.ethicalMetrics.fairness);
      ageBuckets[bucket].transparency.push(result.ethicalMetrics.transparency);
      ageBuckets[bucket].morals.push(result.ethicalMetrics.morals);
      ageBuckets[bucket].bias.push(result.ethicalMetrics.bias);
      ageBuckets[bucket].totalCount++;
      if (result.prediction === 'layoff') {
        ageBuckets[bucket].layoffCount++;
      }
    });
    
    return Object.entries(ageBuckets).map(([age, metrics]) => ({
      name: age,
      fairness: metrics.fairness.length ? metrics.fairness.reduce((a, b) => a + b, 0) / metrics.fairness.length : 0,
      transparency: metrics.transparency.length ? metrics.transparency.reduce((a, b) => a + b, 0) / metrics.transparency.length : 0,
      morals: metrics.morals.length ? metrics.morals.reduce((a, b) => a + b, 0) / metrics.morals.length : 0,
      bias: metrics.bias.length ? metrics.bias.reduce((a, b) => a + b, 0) / metrics.bias.length : 0,
      layoffRate: metrics.totalCount ? (metrics.layoffCount / metrics.totalCount) * 100 : 0,
      layoffCount: metrics.layoffCount,
      totalCount: metrics.totalCount
    }));
  }, [results]);
  
  // Overall metrics for radar chart
  const overallRadarData = [
    {
      subject: 'Fairness',
      A: results.reduce((sum, r) => sum + r.ethicalMetrics.fairness, 0) / results.length,
      fullMark: 100,
    },
    {
      subject: 'Transparency',
      A: results.reduce((sum, r) => sum + r.ethicalMetrics.transparency, 0) / results.length,
      fullMark: 100,
    },
    {
      subject: 'Morals',
      A: results.reduce((sum, r) => sum + r.ethicalMetrics.morals, 0) / results.length,
      fullMark: 100,
    },
    {
      subject: 'Bias Mitigation',
      A: 100 - (results.reduce((sum, r) => sum + r.ethicalMetrics.bias, 0) / results.length),
      fullMark: 100,
    },
    {
      subject: 'Decision Confidence',
      A: results.reduce((sum, r) => sum + r.confidence, 0) / results.length,
      fullMark: 100,
    },
  ];
  
  // Risk factors
  const potentialRisks = React.useMemo(() => {
    const risks = [];
    
    // Check for gender bias
    const genderLayoffRates = genderEthics.map(g => ({ gender: g.name, rate: g.layoffRate }));
    if (genderLayoffRates.length >= 2) {
      const maxRate = Math.max(...genderLayoffRates.map(g => g.rate));
      const minRate = Math.min(...genderLayoffRates.map(g => g.rate));
      
      if (maxRate - minRate > 10) {
        risks.push({
          name: 'Potential Gender Bias',
          severity: 'High',
          description: `Layoff rates differ by ${Math.round(maxRate - minRate)}% between genders.`
        });
      }
    }
    
    // Check for age bias
    const ageLayoffRates = ageEthics.filter(a => a.totalCount > 0)
      .map(a => ({ age: a.name, rate: a.layoffRate }));
    
    if (ageLayoffRates.length >= 2) {
      const maxRate = Math.max(...ageLayoffRates.map(a => a.rate));
      const minRate = Math.min(...ageLayoffRates.map(a => a.rate));
      
      if (maxRate - minRate > 15) {
        risks.push({
          name: 'Potential Age Bias',
          severity: 'Medium',
          description: `Layoff rates differ by ${Math.round(maxRate - minRate)}% between age groups.`
        });
      }
    }
    
    // Check for department-level ethical issues
    departmentEthics.forEach(dept => {
      if (dept.fairness < 75) {
        risks.push({
          name: `Low Fairness in ${dept.name}`,
          severity: 'Medium',
          description: `Fairness score of ${Math.round(dept.fairness)}% may indicate issues.`
        });
      }
      
      if (dept.bias > 40) {
        risks.push({
          name: `High Bias in ${dept.name}`,
          severity: 'High',
          description: `Bias score of ${Math.round(dept.bias)}% exceeds recommended threshold.`
        });
      }
    });
    
    return risks;
  }, [departmentEthics, genderEthics, ageEthics]);
  
  return (
    <Card className="glassmorphism shadow-lg">
      <CardHeader>
        <CardTitle>Advanced Ethical Impact Analysis</CardTitle>
        <CardDescription>
          Deep dive into ethical implications across demographic dimensions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overall">Overall</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overall" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-72">
                <h3 className="text-sm font-medium mb-3">Ethical Dimensions</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart outerRadius={90} width={730} height={250} data={overallRadarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="AI Model"
                      dataKey="A"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.6}
                    />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Ethical AI Index Score</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-2xl font-bold">
                      {Math.round((
                        (overallRadarData[0].A + 
                         overallRadarData[1].A + 
                         overallRadarData[2].A + 
                         overallRadarData[3].A) / 4
                      ))}%
                    </div>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      {
                        overallRadarData[0].A > 85 ? 'Excellent' :
                        overallRadarData[0].A > 75 ? 'Good' :
                        overallRadarData[0].A > 65 ? 'Acceptable' : 'Needs Review'
                      }
                    </Badge>
                  </div>
                  <Progress 
                    value={(
                      (overallRadarData[0].A + 
                       overallRadarData[1].A + 
                       overallRadarData[2].A + 
                       overallRadarData[3].A) / 4
                    )} 
                    className="h-2" 
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Key Ethical Metrics</h3>
                  {overallRadarData.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm">{item.subject}</span>
                        <span className="text-sm font-medium">{Math.round(item.A)}%</span>
                      </div>
                      <Progress value={item.A} className="h-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Executive Summary</h3>
              <p className="text-sm">
                The layoff prediction model demonstrates {
                  overallRadarData[0].A > 85 ? 'excellent' :
                  overallRadarData[0].A > 75 ? 'good' :
                  overallRadarData[0].A > 65 ? 'acceptable' : 'concerning'
                } ethical metrics overall. 
                Fairness and transparency scores are {
                  (overallRadarData[0].A + overallRadarData[1].A) / 2 > 80 ? 'strong' : 'moderate'
                }, while bias mitigation shows {
                  overallRadarData[3].A > 75 ? 'effective results' : 'room for improvement'
                }.
                {potentialRisks.length > 0 ? 
                  ` However, ${potentialRisks.length} potential ethical concerns have been identified and should be addressed.` :
                  ' No significant ethical risks were identified in this analysis.'
                }
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="departments" className="space-y-6">
            <div className="h-80">
              <h3 className="text-sm font-medium mb-3">Ethical Metrics by Department</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={departmentEthics}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="fairness" name="Fairness" fill="#8B5CF6" />
                  <Bar dataKey="transparency" name="Transparency" fill="#0EA5E9" />
                  <Bar dataKey="morals" name="Morals" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-80">
              <h3 className="text-sm font-medium mb-3">Bias by Department (Lower is Better)</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={departmentEthics}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bias" name="Bias" fill="#F97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="h-64">
                  <h3 className="text-sm font-medium mb-3">Fairness by Gender</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={genderEthics}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fairness" name="Fairness" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-64">
                  <h3 className="text-sm font-medium mb-3">Layoff Rate by Gender</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={genderEthics}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="layoffRate" name="Layoff Rate (%)" fill="#F97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="h-64">
                  <h3 className="text-sm font-medium mb-3">Fairness by Age Group</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ageEthics}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fairness" name="Fairness" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="h-64">
                  <h3 className="text-sm font-medium mb-3">Layoff Rate by Age Group</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ageEthics}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="layoffRate" name="Layoff Rate (%)" fill="#F97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="risks" className="space-y-6">
            {potentialRisks.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Identified Ethical Risk Factors</h3>
                <div className="space-y-3">
                  {potentialRisks.map((risk, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 rounded-md bg-background/70 border border-border">
                      <div>
                        <Badge className={
                          risk.severity === 'High' ? 'bg-red-500' : 
                          risk.severity === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                        }>
                          {risk.severity}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-medium">{risk.name}</h4>
                        <p className="text-sm text-muted-foreground">{risk.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-md bg-yellow-500/10 border border-yellow-500/30">
                  <h4 className="font-medium text-yellow-500 mb-1">Recommended Actions</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Review the model's parameters and weighting to address potential bias.</li>
                    <li>Consider including additional demographic-neutral factors in the model.</li>
                    <li>Implement human oversight and review for high-risk predictions.</li>
                    <li>Document all issues and mitigations for transparency reporting.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">No Critical Risks Detected</h3>
                <p className="text-muted-foreground">
                  The analysis did not identify any significant ethical concerns with the current prediction model.
                  Continue monitoring as new data comes in.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EthicalImpactAnalysis;
