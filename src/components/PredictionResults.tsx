
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import EthicalMetrics from './EthicalMetrics';
import DepartmentVisualization from './DepartmentVisualization';
import ScenarioModeling from './ScenarioModeling';
import EthicalImpactAnalysis from './EthicalImpactAnalysis';
import RetentionRecommendations from './RetentionRecommendations';
import DataVisualization3D from './DataVisualization3D';
import { PredictionResult } from '@/services/mlService';
import { FileDown, Info, BarChart3 } from 'lucide-react';

interface PredictionResultsProps {
  results: PredictionResult[];
}

const PredictionResults: React.FC<PredictionResultsProps> = ({ results }) => {
  const [selectedResult, setSelectedResult] = useState<PredictionResult | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('summary');
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const currentResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const downloadResultsCSV = () => {
    const headers = [
      "name",
      "department", 
      "role",
      "prediction",
      "confidence",
      "fairness",
      "transparency",
      "morals",
      "bias",
      "explanation"
    ];
    
    const rows = results.map(result => [
      result.employee.name,
      result.employee.department,
      result.employee.role,
      result.prediction,
      result.confidence.toFixed(1),
      result.ethicalMetrics.fairness.toFixed(1),
      result.ethicalMetrics.transparency.toFixed(1),
      result.ethicalMetrics.morals.toFixed(1),
      result.ethicalMetrics.bias.toFixed(1),
      result.explanation.replace(/,/g, ";") // Replace commas in text to avoid CSV issues
    ]);
    
    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create element to trigger download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ai_prediction_results.csv");
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate overall ethical metrics by averaging all results
  const overallEthicalMetrics = results.length > 0 
    ? {
        fairness: results.reduce((sum, r) => sum + r.ethicalMetrics.fairness, 0) / results.length,
        transparency: results.reduce((sum, r) => sum + r.ethicalMetrics.transparency, 0) / results.length,
        morals: results.reduce((sum, r) => sum + r.ethicalMetrics.morals, 0) / results.length,
        bias: results.reduce((sum, r) => sum + r.ethicalMetrics.bias, 0) / results.length
      }
    : { fairness: 0, transparency: 0, morals: 0, bias: 0 };

  const retainCount = results.filter(r => r.prediction === "retain").length;
  const layoffCount = results.filter(r => r.prediction === "layoff").length;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="ethical">Ethical Impact</TabsTrigger>
          <TabsTrigger value="retention">Retention</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="visual3d">3D Visualization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glassmorphism shadow-lg md:col-span-2">
              <CardHeader>
                <CardTitle>Prediction Summary</CardTitle>
                <CardDescription>AI model assessment results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{results.length}</div>
                      <div className="text-sm text-muted-foreground">Total Employees</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-500">{retainCount}</div>
                      <div className="text-sm text-muted-foreground">Retain</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-500">{layoffCount}</div>
                      <div className="text-sm text-muted-foreground">Consider for Layoff</div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={downloadResultsCSV}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Export Results
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <EthicalMetrics
              fairness={overallEthicalMetrics.fairness}
              transparency={overallEthicalMetrics.transparency}
              morals={overallEthicalMetrics.morals}
              bias={overallEthicalMetrics.bias}
            />
          </div>

          <Card className="glassmorphism shadow-lg">
            <CardHeader>
              <CardTitle>Employee Predictions</CardTitle>
              <CardDescription>
                Review AI-generated workforce recommendations with ethical considerations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Recommendation</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{result.employee.name}</TableCell>
                        <TableCell>{result.employee.department}</TableCell>
                        <TableCell>{result.employee.role}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={
                              result.prediction === 'retain' 
                                ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }
                          >
                            {result.prediction === 'retain' ? 'Retain' : 'Consider for Layoff'}
                          </Badge>
                        </TableCell>
                        <TableCell>{result.confidence.toFixed(1)}%</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedResult(result)}
                              >
                                <Info className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            {selectedResult && selectedResult.employee.id === result.employee.id && (
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Prediction Details: {result.employee.name}</DialogTitle>
                                </DialogHeader>
                                <Tabs defaultValue="explanation">
                                  <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="explanation">Explanation</TabsTrigger>
                                    <TabsTrigger value="ethics">Ethics Analysis</TabsTrigger>
                                    <TabsTrigger value="employee">Employee Data</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="explanation" className="space-y-4 pt-4">
                                    <div className="rounded-lg bg-muted/50 p-4">
                                      <p>{result.explanation}</p>
                                    </div>
                                    <div>
                                      <h3 className="font-medium mb-2">Recommendation</h3>
                                      <Badge 
                                        className={
                                          result.prediction === 'retain' 
                                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                                        }
                                      >
                                        {result.prediction === 'retain' ? 'Retain' : 'Consider for Layoff'}
                                      </Badge>
                                      <p className="text-sm mt-2">Confidence: {result.confidence.toFixed(1)}%</p>
                                    </div>
                                    <div className="text-sm text-muted-foreground italic">
                                      Note: This is an AI-generated recommendation and should always be reviewed by human management with ethical considerations.
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="ethics" className="pt-4">
                                    <EthicalMetrics
                                      fairness={result.ethicalMetrics.fairness}
                                      transparency={result.ethicalMetrics.transparency}
                                      morals={result.ethicalMetrics.morals}
                                      bias={result.ethicalMetrics.bias}
                                    />
                                  </TabsContent>
                                  <TabsContent value="employee" className="space-y-2 pt-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h3 className="text-sm font-medium">Department</h3>
                                        <p>{result.employee.department}</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium">Role</h3>
                                        <p>{result.employee.role}</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium">Performance</h3>
                                        <p>{result.employee.performance.toFixed(1)}/5.0</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium">Experience</h3>
                                        <p>{result.employee.yearsOfExperience} years</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium">Skills</h3>
                                        <p>{result.employee.skills.join(", ")}</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium">Projects Completed</h3>
                                        <p>{result.employee.projectsCompleted}</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium">Certifications</h3>
                                        <p>{result.employee.certifications}</p>
                                      </div>
                                      <div>
                                        <h3 className="text-sm font-medium">Peer Rating</h3>
                                        <p>{result.employee.peerRating.toFixed(1)}/5.0</p>
                                      </div>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </DialogContent>
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments">
          <DepartmentVisualization results={results} />
        </TabsContent>
        
        <TabsContent value="ethical">
          <EthicalImpactAnalysis results={results} />
        </TabsContent>
        
        <TabsContent value="retention">
          <RetentionRecommendations results={results} />
        </TabsContent>
        
        <TabsContent value="scenarios">
          <ScenarioModeling 
            employees={results.map(r => r.employee)} 
            currentResults={results} 
          />
        </TabsContent>
        
        <TabsContent value="visual3d">
          <DataVisualization3D results={results} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictionResults;
