
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee } from '@/data/sampleData';
import { downloadSampleCSV } from '@/data/sampleData';
import { processCSVData } from '@/services/mlService';
import { toast } from 'sonner';
import { Upload, FileText, Download } from 'lucide-react';

interface EmployeeFormProps {
  onDataUpload: (employees: Employee[]) => void;
  isBusy: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onDataUpload, isBusy }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          if (e.target?.result) {
            const csvContent = e.target.result.toString();
            const employees = processCSVData(csvContent);
            
            if (employees.length > 0) {
              toast.success(`Successfully processed ${employees.length} employee records`);
              onDataUpload(employees);
            } else {
              toast.error("No valid employee data found in the CSV file");
            }
          }
        } catch (error) {
          console.error("Error processing CSV file:", error);
          toast.error("Error processing the CSV file. Please check the format.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "text/csv" || file.name.endsWith('.csv')) {
        handleFileUpload(file);
      } else {
        toast.error("Please upload a CSV file");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <Card className="w-full glassmorphism shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">AI-Driven Workforce Analysis</CardTitle>
        <CardDescription>
          Upload employee data to generate ethical layoff predictions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors ${
            isDragActive 
              ? "border-primary bg-primary/10" 
              : "border-muted-foreground/25 hover:border-primary/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragActive(true);
          }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Drag & drop your CSV file</h3>
              <p className="text-muted-foreground text-sm">
                Upload your employee dataset in CSV format
              </p>
            </div>
            <div>
              <label htmlFor="file-upload">
                <Button disabled={isBusy} variant="outline" className="cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  Select File
                </Button>
              </label>
              <Input 
                id="file-upload" 
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={handleInputChange}
                disabled={isBusy}
              />
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Need a sample file format?
          </p>
          <Button 
            variant="outline" 
            onClick={downloadSampleCSV}
            disabled={isBusy}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Sample CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeForm;
