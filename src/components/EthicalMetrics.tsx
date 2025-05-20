
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface EthicalMetricsProps {
  fairness: number;
  transparency: number;
  morals: number;
  bias: number;
}

const EthicalMetrics: React.FC<EthicalMetricsProps> = ({
  fairness,
  transparency,
  morals,
  bias
}) => {
  // For bias, lower is better (less biased)
  const biasScore = 100 - bias;

  return (
    <Card className="glassmorphism shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          Ethical Metrics
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="ml-2 h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>These metrics evaluate the ethical dimensions of the AI prediction model.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Evaluation of model bias, fairness, transparency, and moral considerations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Fairness</label>
            <span className="text-sm">{Math.round(fairness)}%</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress value={fairness} className="h-2 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Measures how evenly the model treats different employee groups without discrimination.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Transparency</label>
            <span className="text-sm">{Math.round(transparency)}%</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress value={transparency} className="h-2 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Indicates how clearly the model's decision-making process can be understood and explained.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Moral Consideration</label>
            <span className="text-sm">{Math.round(morals)}%</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress value={morals} className="h-2 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Evaluates how well the model considers ethical implications and employee well-being.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Bias Mitigation</label>
            <span className="text-sm">{Math.round(biasScore)}%</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Progress value={biasScore} className="h-2 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Measures how well the model prevents and mitigates algorithmic biases.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default EthicalMetrics;
