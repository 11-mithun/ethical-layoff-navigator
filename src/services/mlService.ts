import { Employee } from "../data/sampleData";

export interface PredictionResult {
  employee: Employee;
  prediction: "retain" | "layoff";
  confidence: number;
  ethicalMetrics: {
    fairness: number;
    transparency: number;
    morals: number;
    bias: number;
  };
  explanation: string;
}

// Mock ML Service that simulates AI predictions
export const predictLayoffs = (employees: Employee[]): PredictionResult[] => {
  return employees.map(employee => {
    // Calculate weighted score based on various factors
    // This is a simplified model that takes into account different aspects
    const performanceScore = employee.performance * 2.5;  // Scale: 0-12.5
    const experienceScore = Math.min(employee.yearsOfExperience * 0.8, 8);  // Scale: 0-8, cap at 10 years
    const skillDiversityScore = Math.min(employee.skills.length * 1.5, 6);  // Scale: 0-6
    const projectScore = Math.min(employee.projectsCompleted * 0.25, 5);  // Scale: 0-5
    const certificationsScore = Math.min(employee.certifications * 1.0, 4);  // Scale: 0-4
    const attendanceScore = (employee.attendance - 85) * 0.2;  // Scale: 0-3
    const peerScore = employee.peerRating * 1.5;  // Scale: 0-7.5
    
    // Total max score: 46
    const totalScore = performanceScore + experienceScore + skillDiversityScore + 
                       projectScore + certificationsScore + attendanceScore + peerScore;
    
    // Normalize to 0-100 scale
    const normalizedScore = Math.min(Math.max((totalScore / 46) * 100, 0), 100);
    
    // Add some randomness to make it more realistic
    // This represents unknown factors and model uncertainty
    const randomFactor = Math.random() * 10 - 5; // -5 to +5
    
    const finalScore = normalizedScore + randomFactor;
    
    // Calculate ethical metrics
    const fairness = calculateFairnessScore(employee);
    const transparency = calculateTransparencyScore(normalizedScore, finalScore);
    const morals = calculateMoralsScore(employee, finalScore);
    const bias = calculateBiasScore(employee);
    
    // Threshold for layoff prediction
    const layoffThreshold = 70;
    const prediction = finalScore >= layoffThreshold ? "retain" : "layoff";
    
    // Generate explanation based on factors
    const confidenceScore = Math.abs((finalScore - layoffThreshold) / 2);
    const explanation = generateExplanation(employee, prediction, {
      performance: performanceScore,
      experience: experienceScore,
      skills: skillDiversityScore,
      projects: projectScore,
      certifications: certificationsScore,
      attendance: attendanceScore,
      peer: peerScore
    });
    
    return {
      employee,
      prediction,
      confidence: Math.min(confidenceScore, 100),
      ethicalMetrics: {
        fairness,
        transparency,
        morals,
        bias
      },
      explanation
    };
  });
};

// Calculate fairness score based on demographic factors
const calculateFairnessScore = (employee: Employee): number => {
  // Higher score means more fair
  let fairness = 85; // Base fairness score
  
  // We'll randomly adjust fairness to simulate real-world fairness evaluation
  // In a real system, this would use much more sophisticated methods
  fairness += Math.random() * 15;
  
  return Math.min(Math.max(fairness, 0), 100);
};

// Transparency is based on how consistent the raw score is with the final score
const calculateTransparencyScore = (rawScore: number, finalScore: number): number => {
  const discrepancy = Math.abs(rawScore - finalScore);
  return Math.max(100 - (discrepancy * 5), 60); // Higher score means more transparent
};

// Morals score reflects ethical considerations in the decision
const calculateMoralsScore = (employee: Employee, score: number): number => {
  // Simulate the moral score with a base value and small adjustments
  let morals = 75; // Base morals score
  
  // Add some variation but keep it relatively high
  morals += Math.random() * 20;
  
  return Math.min(Math.max(morals, 0), 100);
};

// Bias score - lower is better (less biased)
const calculateBiasScore = (employee: Employee): number => {
  // Start with a moderate bias rating
  let bias = 30; // Base bias score
  
  // Random variation to simulate real-world bias detection
  bias += Math.random() * 20 - 10;
  
  return Math.min(Math.max(bias, 0), 100);
};

// Generate natural language explanation
const generateExplanation = (
  employee: Employee, 
  prediction: string, 
  scores: {
    performance: number;
    experience: number;
    skills: number;
    projects: number;
    certifications: number;
    attendance: number;
    peer: number;
  }
): string => {
  const name = employee.name.split(' ')[0];
  
  if (prediction === "retain") {
    // Find the top 2 strengths
    const strengths = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([key]) => key);
      
    const strengthsText = strengths.map(strength => {
      switch(strength) {
        case 'performance': return 'strong performance reviews';
        case 'experience': return 'valuable experience';
        case 'skills': return 'diverse skill set';
        case 'projects': return 'impressive project completion rate';
        case 'certifications': return 'professional certifications';
        case 'attendance': return 'excellent attendance record';
        case 'peer': return 'high peer ratings';
        default: return '';
      }
    }).join(' and ');
    
    return `${name} is recommended for retention primarily due to ${strengthsText}. Their overall contribution to the company appears to be valuable based on the analyzed factors.`;
  } else {
    // Find the bottom 2 weaknesses
    const weaknesses = Object.entries(scores)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 2)
      .map(([key]) => key);
      
    const weaknessesText = weaknesses.map(weakness => {
      switch(weakness) {
        case 'performance': return 'performance metrics below target';
        case 'experience': return 'limited experience in current role';
        case 'skills': return 'narrow skill set for current needs';
        case 'projects': return 'fewer completed projects than peers';
        case 'certifications': return 'lack of relevant certifications';
        case 'attendance': return 'attendance concerns';
        case 'peer': return 'lower peer evaluation scores';
        default: return '';
      }
    }).join(' and ');
    
    return `The model suggests ${name} may be considered for workforce reduction based on ${weaknessesText}. However, this is an algorithmic suggestion and should be reviewed by HR with ethical considerations before any action.`;
  }
};

export const processCSVData = (csvContent: string): Employee[] => {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map((line, index) => {
    const values = line.split(',');
    const employee: Partial<Employee> = {};
    
    headers.forEach((header, i) => {
      const value = values[i];
      switch(header.trim()) {
        case 'id':
          employee.id = Number(value);
          break;
        case 'name':
          employee.name = value;
          break;
        case 'age':
          employee.age = Number(value);
          break;
        case 'gender':
          employee.gender = value;
          break;
        case 'department':
          employee.department = value;
          break;
        case 'role':
          employee.role = value;
          break;
        case 'performance':
          employee.performance = Number(value);
          break;
        case 'yearsOfExperience':
          employee.yearsOfExperience = Number(value);
          break;
        case 'skills':
          employee.skills = value.split('|');
          break;
        case 'salary':
          employee.salary = Number(value);
          break;
        case 'projectsCompleted':
          employee.projectsCompleted = Number(value);
          break;
        case 'certifications':
          employee.certifications = Number(value);
          break;
        case 'attendance':
          employee.attendance = Number(value);
          break;
        case 'peerRating':
          employee.peerRating = Number(value);
          break;
        default:
          break;
      }
    });
    
    return employee as Employee;
  });
};
