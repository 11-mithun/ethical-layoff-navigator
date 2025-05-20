
export interface Employee {
  id: number;
  name: string;
  age: number;
  gender: string;
  department: string;
  role: string;
  performance: number;
  yearsOfExperience: number;
  skills: string[];
  salary: number;
  projectsCompleted: number;
  certifications: number;
  attendance: number;
  peerRating: number;
}

export const sampleEmployees: Employee[] = [
  {
    id: 1,
    name: "Arjun Sharma",
    age: 28,
    gender: "Male",
    department: "Engineering",
    role: "Software Engineer",
    performance: 4.2,
    yearsOfExperience: 4,
    skills: ["React", "TypeScript", "Node.js"],
    salary: 1200000,
    projectsCompleted: 12,
    certifications: 2,
    attendance: 96,
    peerRating: 4.5
  },
  {
    id: 2,
    name: "Priya Patel",
    age: 32,
    gender: "Female",
    department: "Product Management",
    role: "Product Manager",
    performance: 4.7,
    yearsOfExperience: 6,
    skills: ["Agile", "User Research", "Product Strategy"],
    salary: 1800000,
    projectsCompleted: 9,
    certifications: 3,
    attendance: 98,
    peerRating: 4.8
  },
  {
    id: 3,
    name: "Vikram Singh",
    age: 35,
    gender: "Male",
    department: "Engineering",
    role: "Tech Lead",
    performance: 3.9,
    yearsOfExperience: 8,
    skills: ["Java", "Microservices", "AWS"],
    salary: 2200000,
    projectsCompleted: 15,
    certifications: 4,
    attendance: 92,
    peerRating: 3.7
  },
  {
    id: 4,
    name: "Neha Reddy",
    age: 27,
    gender: "Female",
    department: "Design",
    role: "UI/UX Designer",
    performance: 4.4,
    yearsOfExperience: 3,
    skills: ["Figma", "Adobe XD", "User Research"],
    salary: 1100000,
    projectsCompleted: 8,
    certifications: 1,
    attendance: 97,
    peerRating: 4.3
  },
  {
    id: 5,
    name: "Rajesh Kumar",
    age: 40,
    gender: "Male",
    department: "Sales",
    role: "Sales Manager",
    performance: 3.6,
    yearsOfExperience: 10,
    skills: ["Negotiation", "CRM", "Market Analysis"],
    salary: 2000000,
    projectsCompleted: 120,
    certifications: 2,
    attendance: 91,
    peerRating: 3.5
  },
  {
    id: 6,
    name: "Divya Nair",
    age: 29,
    gender: "Female",
    department: "Engineering",
    role: "QA Engineer",
    performance: 4.0,
    yearsOfExperience: 5,
    skills: ["Selenium", "Cypress", "Manual Testing"],
    salary: 1300000,
    projectsCompleted: 20,
    certifications: 2,
    attendance: 95,
    peerRating: 4.1
  },
  {
    id: 7,
    name: "Amit Kapoor",
    age: 36,
    gender: "Male",
    department: "Marketing",
    role: "Digital Marketing Manager",
    performance: 4.1,
    yearsOfExperience: 7,
    skills: ["SEO", "Content Marketing", "Analytics"],
    salary: 1600000,
    projectsCompleted: 15,
    certifications: 3,
    attendance: 93,
    peerRating: 4.0
  },
  {
    id: 8,
    name: "Sanjana Gupta",
    age: 26,
    gender: "Female",
    department: "HR",
    role: "HR Coordinator",
    performance: 3.8,
    yearsOfExperience: 2,
    skills: ["Recruitment", "Employee Relations", "HRIS"],
    salary: 900000,
    projectsCompleted: 6,
    certifications: 1,
    attendance: 99,
    peerRating: 3.9
  },
  {
    id: 9,
    name: "Karthik Iyer",
    age: 31,
    gender: "Male",
    department: "Engineering",
    role: "DevOps Engineer",
    performance: 4.5,
    yearsOfExperience: 6,
    skills: ["Docker", "Kubernetes", "CI/CD"],
    salary: 1700000,
    projectsCompleted: 18,
    certifications: 5,
    attendance: 94,
    peerRating: 4.4
  },
  {
    id: 10,
    name: "Ananya Desai",
    age: 33,
    gender: "Female",
    department: "Finance",
    role: "Financial Analyst",
    performance: 4.3,
    yearsOfExperience: 7,
    skills: ["Financial Modeling", "Data Analysis", "Forecasting"],
    salary: 1500000,
    projectsCompleted: 12,
    certifications: 2,
    attendance: 97,
    peerRating: 4.2
  },
  {
    id: 11,
    name: "Rahul Menon",
    age: 29,
    gender: "Male",
    department: "Engineering",
    role: "Mobile Developer",
    performance: 3.7,
    yearsOfExperience: 4,
    skills: ["Swift", "Kotlin", "React Native"],
    salary: 1400000,
    projectsCompleted: 9,
    certifications: 1,
    attendance: 92,
    peerRating: 3.8
  },
  {
    id: 12,
    name: "Meera Joshi",
    age: 28,
    gender: "Female",
    department: "Customer Support",
    role: "Support Specialist",
    performance: 4.6,
    yearsOfExperience: 3,
    skills: ["Zendesk", "Customer Service", "Problem Solving"],
    salary: 950000,
    projectsCompleted: 0,
    certifications: 1,
    attendance: 98,
    peerRating: 4.7
  },
  {
    id: 13,
    name: "Aditya Nayak",
    age: 38,
    gender: "Male",
    department: "Engineering",
    role: "Data Engineer",
    performance: 3.9,
    yearsOfExperience: 9,
    skills: ["Python", "SQL", "Hadoop"],
    salary: 1900000,
    projectsCompleted: 14,
    certifications: 3,
    attendance: 91,
    peerRating: 3.6
  },
  {
    id: 14,
    name: "Kavita Sengupta",
    age: 34,
    gender: "Female",
    department: "Legal",
    role: "Legal Counsel",
    performance: 4.2,
    yearsOfExperience: 8,
    skills: ["Contract Law", "IP Law", "Compliance"],
    salary: 2100000,
    projectsCompleted: 25,
    certifications: 2,
    attendance: 96,
    peerRating: 4.0
  },
  {
    id: 15,
    name: "Vivek Verma",
    age: 30,
    gender: "Male",
    department: "Engineering",
    role: "Backend Engineer",
    performance: 4.0,
    yearsOfExperience: 5,
    skills: ["Java", "Spring Boot", "MongoDB"],
    salary: 1500000,
    projectsCompleted: 16,
    certifications: 2,
    attendance: 95,
    peerRating: 4.1
  },
  {
    id: 16,
    name: "Ritu Malhotra",
    age: 27,
    gender: "Female",
    department: "Marketing",
    role: "Content Writer",
    performance: 3.8,
    yearsOfExperience: 3,
    skills: ["Copywriting", "SEO", "Social Media"],
    salary: 1000000,
    projectsCompleted: 22,
    certifications: 1,
    attendance: 97,
    peerRating: 3.7
  },
  {
    id: 17,
    name: "Siddharth Bajaj",
    age: 32,
    gender: "Male",
    department: "Engineering",
    role: "Frontend Developer",
    performance: 3.5,
    yearsOfExperience: 4,
    skills: ["React", "JavaScript", "CSS"],
    salary: 1300000,
    projectsCompleted: 10,
    certifications: 1,
    attendance: 90,
    peerRating: 3.4
  },
  {
    id: 18,
    name: "Pooja Mehta",
    age: 29,
    gender: "Female",
    department: "Data Science",
    role: "Data Scientist",
    performance: 4.8,
    yearsOfExperience: 5,
    skills: ["Python", "Machine Learning", "Statistics"],
    salary: 1700000,
    projectsCompleted: 14,
    certifications: 3,
    attendance: 98,
    peerRating: 4.9
  },
  {
    id: 19,
    name: "Manish Agarwal",
    age: 42,
    gender: "Male",
    department: "Operations",
    role: "Operations Manager",
    performance: 4.3,
    yearsOfExperience: 12,
    skills: ["Process Optimization", "Team Management", "ERP"],
    salary: 2400000,
    projectsCompleted: 32,
    certifications: 4,
    attendance: 94,
    peerRating: 4.2
  },
  {
    id: 20,
    name: "Shreya Banerjee",
    age: 31,
    gender: "Female",
    department: "Engineering",
    role: "System Architect",
    performance: 4.6,
    yearsOfExperience: 7,
    skills: ["System Design", "Cloud Architecture", "Scalability"],
    salary: 2000000,
    projectsCompleted: 17,
    certifications: 5,
    attendance: 96,
    peerRating: 4.5
  }
];

export const downloadSampleCSV = () => {
  const headers = [
    "id",
    "name",
    "age",
    "gender", 
    "department",
    "role",
    "performance",
    "yearsOfExperience",
    "skills",
    "salary",
    "projectsCompleted",
    "certifications",
    "attendance",
    "peerRating"
  ];
  
  const rows = sampleEmployees.map(employee => [
    employee.id,
    employee.name,
    employee.age,
    employee.gender,
    employee.department,
    employee.role,
    employee.performance,
    employee.yearsOfExperience,
    employee.skills.join("|"),
    employee.salary,
    employee.projectsCompleted,
    employee.certifications,
    employee.attendance,
    employee.peerRating
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
  link.setAttribute("download", "employee_sample_data.csv");
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
