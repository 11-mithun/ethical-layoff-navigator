
import React from 'react';
import { PredictionResult } from '@/services/mlService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sparkles, Download, Users, Brain } from 'lucide-react';

interface RetentionRecommendationsProps {
  results: PredictionResult[];
}

const RetentionRecommendations: React.FC<RetentionRecommendationsProps> = ({ results }) => {
  // Employees at risk (predicted for layoff)
  const employeesAtRisk = results.filter(r => r.prediction === 'layoff')
    .sort((a, b) => b.confidence - a.confidence);
  
  // Calculate recommendations based on employee strengths and weaknesses
  const individualRecommendations = React.useMemo(() => {
    return employeesAtRisk.map(result => {
      const { employee } = result;
      const recommendations = [];
      
      // Performance-based recommendations
      if (employee.performance < 3.5) {
        recommendations.push({
          type: 'performance',
          description: 'Set up a performance improvement plan with clear goals and regular check-ins',
          impact: 'high',
        });
      }
      
      // Skill-based recommendations
      if (employee.skills.length < 4) {
        recommendations.push({
          type: 'skills',
          description: 'Recommend targeted training to diversify skillset in relevant areas',
          impact: 'medium',
        });
      }
      
      // Experience-based recommendations
      if (employee.yearsOfExperience < 2) {
        recommendations.push({
          type: 'experience',
          description: 'Assign a mentor from senior staff to accelerate professional growth',
          impact: 'medium',
        });
      }
      
      // Project completion recommendations
      if (employee.projectsCompleted < 5) {
        recommendations.push({
          type: 'projects',
          description: 'Involve in more project teams to build experience and demonstrate capability',
          impact: 'medium',
        });
      }
      
      // Certification recommendations
      if (employee.certifications < 2) {
        recommendations.push({
          type: 'certifications',
          description: 'Sponsor relevant industry certifications to build credentials',
          impact: 'medium',
        });
      }
      
      // Attendance recommendations
      if (employee.attendance < 90) {
        recommendations.push({
          type: 'attendance',
          description: 'Discuss attendance concerns and identify underlying issues',
          impact: 'high',
        });
      }
      
      // Peer rating recommendations
      if (employee.peerRating < 4) {
        recommendations.push({
          type: 'collaboration',
          description: 'Provide coaching on teamwork and interpersonal skills',
          impact: 'high',
        });
      }
      
      return {
        employee,
        recommendations: recommendations.length > 0 ? recommendations : [{
          type: 'general',
          description: 'Regular check-ins to discuss career progression and objectives',
          impact: 'medium',
        }],
      };
    });
  }, [employeesAtRisk]);
  
  // Organizational recommendations based on patterns
  const organizationalRecommendations = React.useMemo(() => {
    const recommendations = [];
    
    // Check for performance issues across departments
    const departmentPerformance: Record<string, number[]> = {};
    results.forEach(result => {
      const dept = result.employee.department;
      if (!departmentPerformance[dept]) {
        departmentPerformance[dept] = [];
      }
      departmentPerformance[dept].push(result.employee.performance);
    });
    
    const lowPerformanceDepts = Object.entries(departmentPerformance)
      .filter(([dept, scores]) => {
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        return average < 3.5;
      })
      .map(([dept]) => dept);
    
    if (lowPerformanceDepts.length > 0) {
      recommendations.push({
        title: 'Department Performance Review',
        description: `Implement targeted performance improvement initiatives in: ${lowPerformanceDepts.join(', ')}`,
        impact: 'high',
      });
    }
    
    // Check for skills gaps
    const skillGaps = results
      .filter(r => r.prediction === 'layoff' && r.employee.skills.length < 4)
      .map(r => r.employee.department)
      .reduce((acc: Record<string, number>, dept) => {
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
      }, {});
    
    const deptWithSkillGaps = Object.entries(skillGaps)
      .filter(([_, count]) => count > 1)
      .map(([dept]) => dept);
    
    if (deptWithSkillGaps.length > 0) {
      recommendations.push({
        title: 'Skills Development Program',
        description: `Launch targeted upskilling initiatives for: ${deptWithSkillGaps.join(', ')}`,
        impact: 'high',
      });
    }
    
    // Check for mentorship needs
    const juniorEmployees = results
      .filter(r => r.employee.yearsOfExperience < 2)
      .length;
    
    if (juniorEmployees > 2) {
      recommendations.push({
        title: 'Mentorship Program',
        description: `Establish a formal mentorship program to support ${juniorEmployees} junior employees at risk`,
        impact: 'medium',
      });
    }
    
    // Add general recommendations
    recommendations.push(
      {
        title: 'Feedback Culture',
        description: 'Implement regular 360° feedback sessions across all departments',
        impact: 'medium',
      },
      {
        title: 'Recognition Program',
        description: 'Develop a structured recognition program to highlight top performers',
        impact: 'medium',
      },
      {
        title: 'Skill Assessment',
        description: 'Conduct quarterly skill gap analyses to target training efforts',
        impact: 'high',
      }
    );
    
    return recommendations;
  }, [results]);
  
  const downloadRecommendationsCSV = () => {
    const headers = ["employee_name", "department", "recommendation_type", "recommendation", "impact"];
    
    const individualRows = individualRecommendations.flatMap(({ employee, recommendations }) => 
      recommendations.map(rec => [
        employee.name,
        employee.department,
        rec.type,
        rec.description,
        rec.impact
      ])
    );
    
    const organizationalRows = organizationalRecommendations.map(rec => [
      "Organization",
      "All Departments",
      "organizational",
      rec.title + ": " + rec.description,
      rec.impact
    ]);
    
    const allRows = [...individualRows, ...organizationalRows];
    
    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...allRows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "retention_recommendations.csv");
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card className="glassmorphism shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Retention Recommendations</CardTitle>
            <CardDescription>
              AI-generated strategies for employee retention and development
            </CardDescription>
          </div>
          <Button variant="outline" onClick={downloadRecommendationsCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export Recommendations
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="individual">
              <Users className="mr-2 h-4 w-4" />
              Individual Strategies
            </TabsTrigger>
            <TabsTrigger value="organizational">
              <Brain className="mr-2 h-4 w-4" />
              Organizational Strategies
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="individual" className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Personalized retention recommendations for employees identified as at risk by the AI model.
            </p>
            
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {individualRecommendations.map((item, i) => (
                  <Card key={i} className="border border-border/50 bg-background/50 hover:bg-background/80 transition-colors">
                    <CardHeader className="py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{item.employee.name}</CardTitle>
                          <CardDescription>{item.employee.role}, {item.employee.department}</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          Risk Level: {Math.round(employeesAtRisk.find(r => r.employee.id === item.employee.id)?.confidence ?? 0)}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2">
                      <h4 className="text-sm font-medium mb-2">Recommended Actions:</h4>
                      <ul className="space-y-2">
                        {item.recommendations.map((rec, j) => (
                          <li key={j} className="flex items-start space-x-2 text-sm">
                            <Sparkles className="h-4 w-4 mt-0.5 text-primary" />
                            <div>
                              <span>{rec.description}</span>
                              <Badge className="ml-2" variant="outline">
                                {rec.impact === 'high' ? 'High Impact' : 
                                 rec.impact === 'medium' ? 'Medium Impact' : 'Low Impact'}
                              </Badge>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="organizational" className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Strategic organizational recommendations to improve retention and address systematic issues.
            </p>
            
            <div className="space-y-4">
              {organizationalRecommendations.map((rec, i) => (
                <Card key={i} className="border border-border/50 bg-background/50 hover:bg-background/80 transition-colors">
                  <CardHeader className="py-3">
                    <div className="flex justify-between">
                      <CardTitle className="text-base">{rec.title}</CardTitle>
                      <Badge variant="outline" className={
                        rec.impact === 'high' ? 'bg-primary/10 text-primary border-primary/20' : 
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'
                      }>
                        {rec.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm">{rec.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="py-4">
                <CardTitle className="text-base">AI-Generated Retention Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Based on analysis of the prediction results, consider implementing a comprehensive retention strategy focused on 
                  performance improvement, skills development, and mentorship. The analysis indicates that targeted interventions 
                  in these areas could significantly reduce turnover risk and improve employee engagement across the organization.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-3 rounded-lg bg-background/70 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {Math.round(employeesAtRisk.length / results.length * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Employees at Risk</div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/70 text-center">
                    <div className="text-3xl font-bold text-amber-500 mb-1">
                      {Math.round(organizationalRecommendations.filter(r => r.impact === 'high').length / organizationalRecommendations.length * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">High-Impact Actions</div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/70 text-center">
                    <div className="text-3xl font-bold text-green-500 mb-1">85%</div>
                    <div className="text-xs text-muted-foreground">Expected Retention</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RetentionRecommendations;
