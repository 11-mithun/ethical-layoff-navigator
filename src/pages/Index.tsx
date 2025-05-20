
import React, { useState } from 'react';
import ThreeScene from '@/components/ThreeScene';
import EmployeeForm from '@/components/EmployeeForm';
import PredictionResults from '@/components/PredictionResults';
import { Button } from '@/components/ui/button';
import { Employee, sampleEmployees } from '@/data/sampleData';
import { PredictionResult, predictLayoffs } from '@/services/mlService';
import { toast } from 'sonner';
import { RefreshCw, Database } from 'lucide-react';

const Index = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleDataUpload = (uploadedEmployees: Employee[]) => {
    setEmployees(uploadedEmployees);
    setShowResults(false);
  };

  const handlePrediction = async () => {
    if (employees.length === 0) {
      toast.error("Please upload employee data first");
      return;
    }

    setIsProcessing(true);
    toast.info("AI model analyzing employee data...");

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate predictions
      const predictions = predictLayoffs(employees);
      setResults(predictions);
      setShowResults(true);
      
      toast.success("Analysis complete");
    } catch (error) {
      console.error("Error generating predictions:", error);
      toast.error("Error generating predictions. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseSampleData = () => {
    setEmployees(sampleEmployees);
    toast.success(`Loaded sample data with ${sampleEmployees.length} employees`);
  };

  return (
    <>
      <ThreeScene />
      <div className="content min-h-screen flex flex-col px-4 py-8 md:px-6">
        <header className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3 animate-fade-in">
            Ethical AI Layoff Prediction System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A sophisticated ML model for workforce decisions with transparency, fairness, and ethical considerations
          </p>
        </header>

        <main className="flex-1 container max-w-6xl mx-auto space-y-10">
          {!showResults ? (
            <div className="space-y-8">
              <EmployeeForm onDataUpload={handleDataUpload} isBusy={isProcessing} />
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {employees.length > 0 ? (
                  <Button 
                    size="lg" 
                    className="gap-2" 
                    onClick={handlePrediction}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Database className="h-5 w-5" />
                        Run Ethical AI Analysis
                      </>
                    )}
                  </Button>
                ) : (
                  <Button size="lg" variant="outline" onClick={handleUseSampleData}>
                    Use Sample Data
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <PredictionResults results={results} />
              
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setShowResults(false)}
                >
                  Back to Upload
                </Button>
              </div>
            </div>
          )}
        </main>
        
        <footer className="mt-auto pt-8 text-center text-sm text-muted-foreground">
          <p>
            Ethical AI Layoff Prediction System — Built with fairness, transparency, and ethical principles
          </p>
        </footer>
      </div>
    </>
  );
};

export default Index;
