
import React, { useState } from 'react';
import { Employee } from '@/data/sampleData';
import { PredictionResult, predictLayoffs } from '@/services/mlService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw } from 'lucide-react';

interface ScenarioModelingProps {
  employees: Employee[];
  currentResults: PredictionResult[];
}

interface ScenarioParams {
  performanceWeight: number;
  experienceWeight: number;
  skillsWeight: number;
}

const ScenarioModeling: React.FC<ScenarioModelingProps> = ({ employees, currentResults }) => {
  const [scenarios, setScenarios] = useState<{ name: string; params: ScenarioParams; results: PredictionResult[] }[]>([
    {
      name: 'Current',
      params: { performanceWeight: 1, experienceWeight: 1, skillsWeight: 1 },
      results: currentResults
    }
  ]);
  
  const [scenarioName, setScenarioName] = useState('Scenario ' + (scenarios.length + 1));
  const [params, setParams] = useState<ScenarioParams>({
    performanceWeight: 1.2,
    experienceWeight: 0.8,
    skillsWeight: 1.5
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateScenario = () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // In a real implementation, we would pass these weights to the prediction algorithm
      // For this demo, we're just going to generate a modified result set
      const modifiedEmployees = employees.map(emp => {
        // Create a copy with slightly modified properties based on weights
        return {
          ...emp,
          performance: Math.min(5, emp.performance * (params.performanceWeight * 0.2 + 0.8)),
          yearsOfExperience: Math.round(emp.yearsOfExperience * (params.experienceWeight * 0.2 + 0.8)),
          skills: emp.skills.slice(0, Math.ceil(emp.skills.length * (params.skillsWeight * 0.2 + 0.8)))
        };
      });
      
      const newResults = predictLayoffs(modifiedEmployees);
      
      setScenarios([...scenarios, {
        name: scenarioName,
        params: { ...params },
        results: newResults
      }]);
      
      setScenarioName('Scenario ' + (scenarios.length + 2));
      setIsGenerating(false);
    }, 1500);
  };
  
  const comparisonData = scenarios.map(scenario => {
    const layoffCount = scenario.results.filter(r => r.prediction === 'layoff').length;
    const retainCount = scenario.results.filter(r => r.prediction === 'retain').length;
    const avgFairness = scenario.results.reduce((sum, r) => sum + r.ethicalMetrics.fairness, 0) / scenario.results.length;
    const avgTransparency = scenario.results.reduce((sum, r) => sum + r.ethicalMetrics.transparency, 0) / scenario.results.length;
    
    return {
      name: scenario.name,
      layoffs: layoffCount,
      retained: retainCount,
      fairness: avgFairness.toFixed(1),
      transparency: avgTransparency.toFixed(1)
    };
  });
  
  return (
    <Card className="glassmorphism shadow-lg">
      <CardHeader>
        <CardTitle>Alternative Scenarios Modeling</CardTitle>
        <CardDescription>
          Model different scenarios with adjusted parameters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Create New Scenario</h3>
              
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Scenario Name</label>
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  className="w-full p-2 rounded-md border border-input bg-background"
                />
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm">Performance Impact</label>
                    <span className="text-sm font-medium">{params.performanceWeight.toFixed(1)}x</span>
                  </div>
                  <Slider 
                    value={[params.performanceWeight * 10]} 
                    min={5} 
                    max={20} 
                    step={1}
                    onValueChange={(vals) => setParams({...params, performanceWeight: vals[0] / 10})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm">Experience Impact</label>
                    <span className="text-sm font-medium">{params.experienceWeight.toFixed(1)}x</span>
                  </div>
                  <Slider 
                    value={[params.experienceWeight * 10]} 
                    min={5} 
                    max={20} 
                    step={1}
                    onValueChange={(vals) => setParams({...params, experienceWeight: vals[0] / 10})}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm">Skills Diversity Impact</label>
                    <span className="text-sm font-medium">{params.skillsWeight.toFixed(1)}x</span>
                  </div>
                  <Slider 
                    value={[params.skillsWeight * 10]} 
                    min={5} 
                    max={20} 
                    step={1}
                    onValueChange={(vals) => setParams({...params, skillsWeight: vals[0] / 10})}
                  />
                </div>
              </div>
              
              <Button 
                onClick={generateScenario} 
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Scenario...
                  </>
                ) : (
                  'Generate Scenario'
                )}
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Scenario Comparison</h3>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="layoffs" name="Layoffs" fill="#ef4444" />
                  <Bar dataKey="retained" name="Retained" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={comparisonData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="fairness" name="Fairness Score" fill="#8b5cf6" />
                  <Bar dataKey="transparency" name="Transparency Score" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScenarioModeling;
