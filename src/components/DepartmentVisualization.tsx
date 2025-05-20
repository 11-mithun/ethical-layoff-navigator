
import React, { useMemo } from 'react';
import { PredictionResult } from '@/services/mlService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DepartmentVisualizationProps {
  results: PredictionResult[];
}

const DepartmentVisualization: React.FC<DepartmentVisualizationProps> = ({ results }) => {
  const departmentData = useMemo(() => {
    const departments: Record<string, { total: number, layoffs: number }> = {};
    
    results.forEach(result => {
      const dept = result.employee.department;
      if (!departments[dept]) {
        departments[dept] = { total: 0, layoffs: 0 };
      }
      departments[dept].total += 1;
      if (result.prediction === 'layoff') {
        departments[dept].layoffs += 1;
      }
    });
    
    return Object.entries(departments).map(([name, { total, layoffs }]) => ({
      name,
      value: total,
      layoffs,
      retention: total - layoffs,
      layoffPercentage: total > 0 ? Math.round((layoffs / total) * 100) : 0
    }));
  }, [results]);

  const COLORS = ['#8B5CF6', '#0EA5E9', '#F97316', '#D946EF', '#10B981', '#F59E0B', '#6366F1'];
  
  return (
    <Card className="glassmorphism shadow-lg">
      <CardHeader>
        <CardTitle>Department Analysis</CardTitle>
        <CardDescription>
          Employee distribution and impact by department
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-3">Department Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [value, 'Employees']}
                    labelFormatter={label => `Department: ${label}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-sm font-medium mb-3">Layoff Impact by Department</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="layoffs"
                    label={({ name, layoffPercentage }) => `${name} ${layoffPercentage}%`}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.layoffPercentage > 30 ? '#ef4444' : COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [value, 'Layoffs']}
                    labelFormatter={label => `Department: ${label}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Layoffs</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Retention</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Impact %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {departmentData.map((dept, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 whitespace-nowrap">{dept.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{dept.value}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{dept.layoffs}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{dept.retention}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={dept.layoffPercentage > 30 ? "text-red-500 font-medium" : ""}>
                      {dept.layoffPercentage}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepartmentVisualization;
