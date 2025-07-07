import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Activity, 
  Calendar, 
  FileText, 
  Heart, 
  MessageSquare, 
  Pill, 
  Search, 
  ShoppingCart, 
  Stethoscope, 
  User,
  Camera,
  BookOpen,
  TrendingUp,
  LogOut,
  Mic,
  MicOff,
  Copy,
  Check,
  Plus,
  Minus,
  CreditCard,
  AlertTriangle,
  Leaf,
  Apple,
  Shield,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  Clock,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Globe
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { analyzeSymptoms, analyzeMedicalImage, checkMedication, explainMedicalTerm, generateHealthCoaching, generateReportSummary, generateAIDoctorConsultation } from '../../lib/ai';
import { speechToTextService } from '../../lib/speechToText';

interface PatientDashboardProps {
  user: any;
}

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  country: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
}

interface AppointmentData {
  id: string;
  doctor_name: string;
  specialty: string;
  scheduled_at: string;
  status: string;
  notes?: string;
}

export function PatientDashboard({ user }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Loading states
  const [isSymptomsAnalyzing, setIsSymptomsAnalyzing] = useState(false);
  const [isMedicationChecking, setIsMedicationChecking] = useState(false);
  const [isImageAnalyzing, setIsImageAnalyzing] = useState(false);
  const [isTermExplaining, setIsTermExplaining] = useState(false);
  const [isHealthCoaching, setIsHealthCoaching] = useState(false);
  const [isReportGenerating, setIsReportGenerating] = useState(false);
  
  // Form states
  const [symptoms, setSymptoms] = useState('');
  const [symptomsResult, setSymptomsResult] = useState('');
  const [medicationQuery, setMedicationQuery] = useState('');
  const [medicationResult, setMedicationResult] = useState('');
  const [medicalTerm, setMedicalTerm] = useState('');
  const [termExplanation, setTermExplanation] = useState('');
  const [healthGoals, setHealthGoals] = useState('');
  const [coachingAdvice, setCoachingAdvice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageAnnotations, setImageAnnotations] = useState<any[]>([]);
  
  // Data states
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  
  // Health vitals state
  const [bloodPressure, setBloodPressure] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [temperature, setTemperature] = useState('');
  const [bmi, setBmi] = useState('');
  const [sleepQuality, setSleepQuality] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [reportSummary, setReportSummary] = useState('');
  
  // Cart and marketplace states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    phone: '',
    address: ''
  });
  
  // Video consultation states
  const [consultationMode, setConsultationMode] = useState<'human' | 'ai' | null>(null);
  const [isConsultationActive, setIsConsultationActive] = useState(false);
  const [consultationTimer, setConsultationTimer] = useState(0);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [aiDoctorMessages, setAiDoctorMessages] = useState<{role: 'user' | 'ai', message: string}[]>([]);
  const [aiDoctorInput, setAiDoctorInput] = useState('');
  const [isAiDoctorSpeaking, setIsAiDoctorSpeaking] = useState(false);
  const [isAiDoctorListening, setIsAiDoctorListening] = useState(false);
  
  // Statistics
  const [stats, setStats] = useState({
    totalConsultations: 0,
    healthScore: 85,
    activeMedications: 3,
    nextAppointment: 'Tomorrow',
    completedConsultations: 0,
    upcomingConsultations: 0
  });

  const itemsPerPage = 12;

  useEffect(() => {
    loadAppointments();
    loadMarketplaceItems();
    loadActivities();
    updateStats();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isConsultationActive) {
      interval = setInterval(() => {
        setConsultationTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConsultationActive]);

  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          scheduled_at,
          status,
          notes,
          doctor_id,
          users!appointments_doctor_id_fkey(name)
        `)
        .eq('patient_id', user.id)
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      
      const formattedAppointments = (data || []).map(apt => ({
        id: apt.id,
        doctor_name: apt.users?.name || 'Dr. Unknown',
        specialty: 'General Medicine',
        scheduled_at: apt.scheduled_at,
        status: apt.status,
        notes: apt.notes
      }));
      
      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      // Set mock data for demo
      setAppointments([
        {
          id: '1',
          doctor_name: 'Dr. Sarah Johnson',
          specialty: 'Cardiology',
          scheduled_at: new Date(Date.now() + 86400000).toISOString(),
          status: 'scheduled'
        },
        {
          id: '2',
          doctor_name: 'Dr. Michael Chen',
          specialty: 'General Medicine',
          scheduled_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'completed'
        }
      ]);
    }
  };

  const loadMarketplaceItems = async () => {
    const mockItems = [
      // Medicines
      { id: 1, name: 'Paracetamol 500mg', category: 'medicine', country: 'Nigeria', popularity: 95, price: 500, priceUSD: 1.2 },
      { id: 2, name: 'Vitamin C 1000mg', category: 'medicine', country: 'USA', popularity: 88, price: 1200, priceUSD: 2.8 },
      { id: 3, name: 'Ibuprofen 400mg', category: 'medicine', country: 'Nigeria', popularity: 90, price: 800, priceUSD: 1.9 },
      { id: 4, name: 'Multivitamin Complex', category: 'medicine', country: 'USA', popularity: 85, price: 2500, priceUSD: 5.9 },
      { id: 5, name: 'Zinc Tablets 50mg', category: 'medicine', country: 'Nigeria', popularity: 78, price: 600, priceUSD: 1.4 },
      { id: 6, name: 'Omega-3 Fish Oil', category: 'medicine', country: 'USA', popularity: 82, price: 3200, priceUSD: 7.5 },
      
      // Fruits
      { id: 7, name: 'Fresh Oranges (6 pcs)', category: 'fruit', country: 'Nigeria', popularity: 90, price: 200, priceUSD: 0.5 },
      { id: 8, name: 'Organic Blueberries', category: 'fruit', country: 'USA', popularity: 87, price: 1500, priceUSD: 3.5 },
      { id: 9, name: 'Bananas (1 bunch)', category: 'fruit', country: 'Nigeria', popularity: 93, price: 150, priceUSD: 0.4 },
      { id: 10, name: 'Avocado (3 pcs)', category: 'fruit', country: 'Nigeria', popularity: 82, price: 300, priceUSD: 0.7 },
      { id: 11, name: 'Strawberries (1 cup)', category: 'fruit', country: 'USA', popularity: 85, price: 1800, priceUSD: 4.2 },
      { id: 12, name: 'Pineapple (1 pc)', category: 'fruit', country: 'Nigeria', popularity: 88, price: 250, priceUSD: 0.6 },
      
      // Vegetables
      { id: 13, name: 'Fresh Spinach (1 bunch)', category: 'vegetable', country: 'Nigeria', popularity: 85, price: 250, priceUSD: 0.6 },
      { id: 14, name: 'Organic Kale', category: 'vegetable', country: 'USA', popularity: 80, price: 800, priceUSD: 1.9 },
      { id: 15, name: 'Broccoli (1 head)', category: 'vegetable', country: 'Nigeria', popularity: 75, price: 400, priceUSD: 0.9 },
      { id: 16, name: 'Carrots (1 kg)', category: 'vegetable', country: 'Nigeria', popularity: 88, price: 180, priceUSD: 0.4 },
      { id: 17, name: 'Bell Peppers (3 pcs)', category: 'vegetable', country: 'Nigeria', popularity: 82, price: 350, priceUSD: 0.8 },
      { id: 18, name: 'Sweet Potatoes (1 kg)', category: 'vegetable', country: 'Nigeria', popularity: 89, price: 200, priceUSD: 0.5 },
      
      // Foods
      { id: 19, name: 'Plantain (6 pcs)', category: 'food', country: 'Nigeria', popularity: 92, price: 300, priceUSD: 0.7 },
      { id: 20, name: 'Quinoa (500g)', category: 'food', country: 'USA', popularity: 78, price: 2200, priceUSD: 5.2 },
      { id: 21, name: 'Brown Rice (1 kg)', category: 'food', country: 'Nigeria', popularity: 85, price: 450, priceUSD: 1.1 },
      { id: 22, name: 'Organic Oats (500g)', category: 'food', country: 'USA', popularity: 83, price: 1200, priceUSD: 2.8 },
      { id: 23, name: 'Honey (500ml)', category: 'food', country: 'Nigeria', popularity: 91, price: 800, priceUSD: 1.9 },
      { id: 24, name: 'Almonds (250g)', category: 'food', country: 'USA', popularity: 86, price: 2800, priceUSD: 6.6 }
    ];
    setMarketplaceItems(mockItems);
  };

  const loadActivities = () => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        type: 'symptom_check',
        description: 'Symptom check completed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: '2',
        type: 'medication_reminder',
        description: 'Medication reminder set',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];
    setActivities(mockActivities);
  };

  const updateStats = () => {
    const completed = appointments.filter(apt => apt.status === 'completed').length;
    const upcoming = appointments.filter(apt => apt.status === 'scheduled').length;
    
    setStats(prev => ({
      ...prev,
      totalConsultations: appointments.length,
      completedConsultations: completed,
      upcomingConsultations: upcoming
    }));
  };

  const addActivity = (type: string, description: string) => {
    const newActivity: Activity = {
      id: Date.now().toString(),
      type,
      description,
      timestamp: new Date()
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      totalConsultations: prev.totalConsultations + 1,
      healthScore: Math.min(100, prev.healthScore + 1)
    }));
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const parseSymptomAnalysis = (analysis: string) => {
    const sections = {
      condition: '',
      remedies: '',
      foods: '',
      medications: '',
      treatment: '',
      warning: ''
    };

    const lines = analysis.split('\n');
    let currentSection = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.toLowerCase().includes('likely condition') || trimmedLine.toLowerCase().includes('diagnosis')) {
        currentSection = 'condition';
      } else if (trimmedLine.toLowerCase().includes('natural remedies') || trimmedLine.toLowerCase().includes('natural treatment')) {
        currentSection = 'remedies';
      } else if (trimmedLine.toLowerCase().includes('healing foods') || trimmedLine.toLowerCase().includes('diet')) {
        currentSection = 'foods';
      } else if (trimmedLine.toLowerCase().includes('recommended medications') || trimmedLine.toLowerCase().includes('medication')) {
        currentSection = 'medications';
      } else if (trimmedLine.toLowerCase().includes('how to take') || trimmedLine.toLowerCase().includes('treatment')) {
        currentSection = 'treatment';
      } else if (trimmedLine.toLowerCase().includes('warning') || trimmedLine.toLowerCase().includes('important')) {
        currentSection = 'warning';
      } else if (trimmedLine && currentSection) {
        sections[currentSection] += trimmedLine + '\n';
      }
    }

    return sections;
  };

  const handleSymptomsAnalysis = async () => {
    if (!symptoms.trim()) return;
    
    setIsSymptomsAnalyzing(true);
    try {
      const result = await analyzeSymptoms(symptoms);
      setSymptomsResult(result);
      addActivity('symptom_check', 'AI symptom analysis completed');
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
    } finally {
      setIsSymptomsAnalyzing(false);
    }
  };

  const handleMedicationCheck = async () => {
    if (!medicationQuery.trim()) return;
    
    setIsMedicationChecking(true);
    try {
      const result = await checkMedication(medicationQuery);
      setMedicationResult(result);
      addActivity('medication_check', 'Medication interaction check completed');
    } catch (error) {
      console.error('Error checking medication:', error);
    } finally {
      setIsMedicationChecking(false);
    }
  };

  const handleTermExplanation = async () => {
    if (!medicalTerm.trim()) return;
    
    setIsTermExplaining(true);
    try {
      const result = await explainMedicalTerm(medicalTerm);
      setTermExplanation(result);
      addActivity('term_explanation', 'Medical term explained');
    } catch (error) {
      console.error('Error explaining term:', error);
    } finally {
      setIsTermExplaining(false);
    }
  };

  const handleHealthCoaching = async () => {
    if (!healthGoals.trim()) return;
    
    setIsHealthCoaching(true);
    try {
      const result = await generateHealthCoaching({ user }, healthGoals);
      setCoachingAdvice(result);
      addActivity('health_coaching', 'Personalized health plan generated');
    } catch (error) {
      console.error('Error generating coaching:', error);
    } finally {
      setIsHealthCoaching(false);
    }
  };

  const generateComputerVisionAnnotations = (file: File) => {
    // Simulate computer vision analysis with realistic medical annotations
    const bodyParts = ['chest', 'abdomen', 'head', 'limbs', 'spine'];
    const anomalies = ['inflammation', 'lesion', 'fracture', 'mass', 'fluid'];
    
    const randomBodyPart = bodyParts[Math.floor(Math.random() * bodyParts.length)];
    const randomAnomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
    
    return [
      {
        id: 1,
        type: 'body_part',
        label: randomBodyPart,
        confidence: 0.92,
        bbox: { x: 120, y: 80, width: 200, height: 150 },
        color: '#3B82F6'
      },
      {
        id: 2,
        type: 'anomaly',
        label: `Possible ${randomAnomaly}`,
        confidence: 0.78,
        bbox: { x: 180, y: 120, width: 80, height: 60 },
        color: '#EF4444'
      },
      {
        id: 3,
        type: 'normal_tissue',
        label: 'Normal tissue',
        confidence: 0.95,
        bbox: { x: 50, y: 200, width: 100, height: 80 },
        color: '#10B981'
      }
    ];
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Please select an image under 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsImageAnalyzing(true);
    
    try {
      // Generate computer vision annotations
      const annotations = generateComputerVisionAnnotations(file);
      setImageAnnotations(annotations);
      
      // Create detailed description for AI analysis
      const annotationText = annotations.map(ann => 
        `${ann.label} detected with ${(ann.confidence * 100).toFixed(1)}% confidence`
      ).join(', ');
      
      const description = `Medical image analysis for ${file.name}. Computer vision detected: ${annotationText}`;
      const result = await analyzeMedicalImage(description, annotationText);
      setImageAnalysis(result);
      addActivity('photo_diagnosis', 'Medical image analyzed with AI');
    } catch (error) {
      console.error('Error analyzing image:', error);
      setImageAnalysis('Error analyzing image. Please try again later or consult with a healthcare professional.');
    } finally {
      setIsImageAnalyzing(false);
    }
  };

  const handleGenerateReportSummary = async () => {
    setIsReportGenerating(true);
    try {
      const vitalsData = {
        bloodPressure,
        heartRate,
        temperature,
        bmi,
        sleepQuality,
        activityLevel
      };
      const result = await generateReportSummary({ appointments, user, vitals: vitalsData });
      setReportSummary(result);
      addActivity('report_summary', 'Health report summary generated');
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsReportGenerating(false);
    }
  };

  const handleSpeechToText = () => {
    if (!speechToTextService.isSupported()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      speechToTextService.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechToTextService.startListening(
        (text) => {
          setSymptoms(prev => prev + ' ' + text);
          setIsListening(false);
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsListening(false);
        }
      );
    }
  };

  // AI Doctor Speech Functions
  const handleAIDoctorSpeechToText = () => {
    if (!speechToTextService.isSupported()) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isAiDoctorListening) {
      speechToTextService.stopListening();
      setIsAiDoctorListening(false);
    } else {
      setIsAiDoctorListening(true);
      speechToTextService.startListening(
        (text) => {
          setAiDoctorInput(text);
          setIsAiDoctorListening(false);
          handleAIDoctorMessage(text);
        },
        (error) => {
          console.error('Speech recognition error:', error);
          setIsAiDoctorListening(false);
        }
      );
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsAiDoctorSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.onend = () => setIsAiDoctorSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const handleAIDoctorMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage = { role: 'user' as const, message };
    setAiDoctorMessages(prev => [...prev, userMessage]);
    setAiDoctorInput('');

    try {
      const response = await generateAIDoctorConsultation(message, { user });
      const aiMessage = { role: 'ai' as const, message: response };
      setAiDoctorMessages(prev => [...prev, aiMessage]);
      
      // Speak the AI response
      speakText(response);
    } catch (error) {
      console.error('Error getting AI doctor response:', error);
      const errorMessage = { role: 'ai' as const, message: "I'm having trouble processing your request. Please try again." };
      setAiDoctorMessages(prev => [...prev, errorMessage]);
    }
  };

  const startConsultation = (mode: 'human' | 'ai') => {
    setConsultationMode(mode);
    setIsConsultationActive(true);
    setConsultationTimer(0);
    
    if (mode === 'ai') {
      const welcomeMessage = {
        role: 'ai' as const,
        message: "Hello! I'm Dr. MedSync AI, your virtual physician. I'm here to help you with your health concerns. Please tell me what's bothering you today, and I'll provide you with a comprehensive assessment and treatment recommendations."
      };
      setAiDoctorMessages([welcomeMessage]);
      speakText(welcomeMessage.message);
    }
    
    addActivity('consultation', `${mode === 'ai' ? 'AI' : 'Human'} doctor consultation started`);
  };

  const endConsultation = () => {
    setIsConsultationActive(false);
    setConsultationMode(null);
    setConsultationTimer(0);
    setAiDoctorMessages([]);
    
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    addActivity('consultation', 'Consultation ended');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Marketplace functions
  const addToCart = (item: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = currency === 'NGN' ? item.price : item.priceUSD || item.price * 0.0024;
      return total + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (!deliveryDetails.name || !deliveryDetails.phone || !deliveryDetails.address) {
      alert('Please fill in all delivery details');
      return;
    }

    const total = getTotalPrice();
    // Simulate Paystack integration
    alert(`Checkout initiated for ${currency} ${total.toFixed(2)}. In production, this would redirect to Paystack payment gateway.`);
    setCart([]);
    setShowCart(false);
    addActivity('purchase', 'Marketplace purchase completed');
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return marketplaceItems.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(marketplaceItems.length / itemsPerPage);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-blue-500/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Total Consultations</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalConsultations}</p>
            </div>
            <Stethoscope className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-green-500/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium">Health Score</p>
              <p className="text-3xl font-bold text-gray-800">{stats.healthScore}%</p>
            </div>
            <Heart className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-orange-500/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 font-medium">Active Medications</p>
              <p className="text-3xl font-bold text-gray-800">{stats.activeMedications}</p>
            </div>
            <Pill className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-purple-500/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-medium">Next Appointment</p>
              <p className="text-lg font-semibold text-gray-800">{stats.nextAppointment}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-blue-500/20 shadow-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-800">{activity.description}</p>
                  <p className="text-sm text-gray-600">
                    {activity.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-green-500/20 shadow-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Health Trends
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-800">Overall Health</span>
                <span className="text-sm text-gray-600">{stats.healthScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-green-200">
                <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{width: `${stats.healthScore}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-800">Medication Adherence</span>
                <span className="text-sm text-gray-600">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-blue-200">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{width: '92%'}}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSymptomChecker = () => {
    const sections = symptomsResult ? parseSymptomAnalysis(symptomsResult) : null;

    return (
      <div className="space-y-6">
        <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-blue-500/30 shadow-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
            <Search className="w-6 h-6 mr-2 text-blue-600" />
            AI Symptom Checker
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <Textarea
                placeholder="Describe your symptoms in detail..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-32 text-gray-800 border-2 border-gray-300"
              />
              <Button
                onClick={handleSpeechToText}
                className={`absolute bottom-3 right-3 p-2 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                size="sm"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            </div>
            <Button 
              onClick={handleSymptomsAnalysis} 
              disabled={isSymptomsAnalyzing || !symptoms.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isSymptomsAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                'Analyze Symptoms'
              )}
            </Button>
          </div>
        </Card>

        {sections && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-red-500/40 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-red-700 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Likely Condition
                </h4>
                <Button
                  onClick={() => handleCopy(sections.condition, 'condition')}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  {copiedStates.condition ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{sections.condition || 'No specific condition identified.'}</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-green-500/40 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-green-700 flex items-center">
                  <Leaf className="w-5 h-5 mr-2" />
                  Natural Remedies
                </h4>
                <Button
                  onClick={() => handleCopy(sections.remedies, 'remedies')}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  {copiedStates.remedies ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{sections.remedies || 'No natural remedies suggested.'}</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-orange-500/40 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-orange-700 flex items-center">
                  <Apple className="w-5 h-5 mr-2" />
                  Healing Foods & Diet
                </h4>
                <Button
                  onClick={() => handleCopy(sections.foods, 'foods')}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  {copiedStates.foods ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{sections.foods || 'No specific dietary recommendations.'}</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-blue-500/40 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-blue-700 flex items-center">
                  <Pill className="w-5 h-5 mr-2" />
                  Recommended Medications
                </h4>
                <Button
                  onClick={() => handleCopy(sections.medications, 'medications')}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  {copiedStates.medications ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{sections.medications || 'No specific medications recommended.'}</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-purple-500/40 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-purple-700 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  How to Take Treatment
                </h4>
                <Button
                  onClick={() => handleCopy(sections.treatment, 'treatment')}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  {copiedStates.treatment ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{sections.treatment || 'No specific treatment instructions.'}</p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-yellow-500/40 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-yellow-700 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Important Warning
                </h4>
                <Button
                  onClick={() => handleCopy(sections.warning, 'warning')}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  {copiedStates.warning ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{sections.warning || 'Always consult healthcare professionals for proper diagnosis and treatment.'}</p>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderPhotodiagnosis = () => (
    <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-green-500/30 shadow-xl">
      <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
        <Camera className="w-6 h-6 mr-2 text-green-600" />
        AI Photo Diagnosis with Computer Vision
      </h3>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={isImageAnalyzing}
          />
          <label htmlFor="image-upload" className={`cursor-pointer ${isImageAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">
              {isImageAnalyzing ? 'Analyzing image...' : 'Click to upload medical photo'}
            </p>
            <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, GIF (max 5MB)</p>
          </label>
        </div>

        {imagePreview && (
          <div className="relative">
            <h4 className="font-semibold text-gray-800 mb-2">Uploaded Image with AI Annotations:</h4>
            <div className="relative inline-block">
              <img 
                src={imagePreview} 
                alt="Medical scan" 
                className="max-w-full h-auto rounded-lg border-2 border-gray-300"
                style={{ maxHeight: '400px' }}
              />
              {/* Computer Vision Annotations */}
              {imageAnnotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className="absolute border-2 rounded"
                  style={{
                    left: `${annotation.bbox.x}px`,
                    top: `${annotation.bbox.y}px`,
                    width: `${annotation.bbox.width}px`,
                    height: `${annotation.bbox.height}px`,
                    borderColor: annotation.color,
                    backgroundColor: `${annotation.color}20`
                  }}
                >
                  <div 
                    className="absolute -top-6 left-0 text-xs font-semibold px-2 py-1 rounded text-white"
                    style={{ backgroundColor: annotation.color }}
                  >
                    {annotation.label} ({(annotation.confidence * 100).toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {imageFile && (
          <div className="text-center">
            <p className="text-sm text-gray-600">Uploaded: {imageFile.name}</p>
          </div>
        )}

        {imageAnalysis && (
          <Card className="p-4 bg-green-50 border-4 border-green-500/30">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-green-800">AI Analysis Results:</h4>
              <Button
                onClick={() => handleCopy(imageAnalysis, 'image')}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                {copiedStates.image ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">{imageAnalysis}</div>
          </Card>
        )}
      </div>
    </Card>
  );

  const renderMedicationCheck = () => (
    <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-orange-500/30 shadow-xl">
      <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
        <Pill className="w-6 h-6 mr-2 text-orange-600" />
        AI Medication & Interaction Checker
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter medication name(s) - separate multiple medications with commas
          </label>
          <Input
            placeholder="e.g., Paracetamol, Ibuprofen, Aspirin"
            value={medicationQuery}
            onChange={(e) => setMedicationQuery(e.target.value)}
            className="text-gray-800 border-2 border-gray-300"
          />
        </div>
        <Button 
          onClick={handleMedicationCheck} 
          disabled={isMedicationChecking || !medicationQuery.trim()}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          {isMedicationChecking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Checking...
            </>
          ) : (
            'Check Medication & Interactions'
          )}
        </Button>
        {medicationResult && (
          <Card className="p-4 bg-orange-50 border-4 border-orange-500/30">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-orange-800">Medication Information:</h4>
              <Button
                onClick={() => handleCopy(medicationResult, 'medication')}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                {copiedStates.medication ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">{medicationResult}</div>
          </Card>
        )}
      </div>
    </Card>
  );

  const renderMedicalTerms = () => (
    <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-purple-500/30 shadow-xl">
      <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
        <BookOpen className="w-6 h-6 mr-2 text-purple-600" />
        Medical Terms Dictionary
      </h3>
      <div className="space-y-4">
        <Input
          placeholder="Enter medical term to explain..."
          value={medicalTerm}
          onChange={(e) => setMedicalTerm(e.target.value)}
          className="text-gray-800 border-2 border-gray-300"
        />
        <Button 
          onClick={handleTermExplanation} 
          disabled={isTermExplaining || !medicalTerm.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
          {isTermExplaining ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Explaining...
            </>
          ) : (
            'Explain Term'
          )}
        </Button>
        {termExplanation && (
          <Card className="p-4 bg-purple-50 border-4 border-purple-500/30">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-purple-800">Explanation:</h4>
              <Button
                onClick={() => handleCopy(termExplanation, 'terms')}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                {copiedStates.terms ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">{termExplanation}</div>
          </Card>
        )}
      </div>
    </Card>
  );

  const renderHealthCoach = () => (
    <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-pink-500/30 shadow-xl">
      <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
        <Heart className="w-6 h-6 mr-2 text-pink-600" />
        AI Health Coach
      </h3>
      <div className="space-y-4">
        <Textarea
          placeholder="What are your health goals? (e.g., lose weight, improve fitness, manage stress...)"
          value={healthGoals}
          onChange={(e) => setHealthGoals(e.target.value)}
          className="min-h-24 text-gray-800 border-2 border-gray-300"
        />
        <Button 
          onClick={handleHealthCoaching} 
          disabled={isHealthCoaching || !healthGoals.trim()}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
        >
          {isHealthCoaching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Advice...
            </>
          ) : (
            'Get Personalized Coaching'
          )}
        </Button>
        {coachingAdvice && (
          <Card className="p-4 bg-pink-50 border-4 border-pink-500/30">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-pink-800">Your Personalized Health Plan:</h4>
              <Button
                onClick={() => handleCopy(coachingAdvice, 'coaching')}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                {copiedStates.coaching ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">{coachingAdvice}</div>
          </Card>
        )}
      </div>
    </Card>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-indigo-500/30 shadow-xl">
        <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
          <Calendar className="w-6 h-6 mr-2 text-indigo-600" />
          Consultation Center
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg border-4 border-indigo-300">
            <p className="text-indigo-100">Total Consultations</p>
            <p className="text-2xl font-bold">{stats.totalConsultations}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-lg border-4 border-green-300">
            <p className="text-green-100">Completed</p>
            <p className="text-2xl font-bold">{stats.completedConsultations}</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-lg border-4 border-orange-300">
            <p className="text-orange-100">Upcoming</p>
            <p className="text-2xl font-bold">{stats.upcomingConsultations}</p>
          </div>
        </div>

        {/* Video Consultation Interface */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Live Video Consultation</h4>
          
          {!consultationMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-blue-50 border-4 border-blue-500/30">
                <h5 className="font-semibold text-blue-800 mb-2">Human Doctor Mode</h5>
                <p className="text-blue-600 text-sm mb-4">Connect with a licensed physician for professional medical consultation</p>
                <Button
                  onClick={() => startConsultation('human')}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Start Human Doctor Consultation
                </Button>
              </Card>
              
              <Card className="p-4 bg-purple-50 border-4 border-purple-500/30">
                <h5 className="font-semibold text-purple-800 mb-2">AI Doctor Mode</h5>
                <p className="text-purple-600 text-sm mb-4">Chat with Dr. MedSync AI for instant medical guidance with voice support</p>
                <Button
                  onClick={() => startConsultation('ai')}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start AI Doctor Consultation
                </Button>
              </Card>
            </div>
          )}

          {consultationMode && (
            <Card className="p-6 bg-gray-50 border-4 border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <h5 className="font-semibold text-gray-800">
                  {consultationMode === 'human' ? 'Human Doctor' : 'AI Doctor'} Consultation
                </h5>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-600 font-mono">{formatTime(consultationTimer)}</span>
                </div>
              </div>

              {consultationMode === 'human' && (
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-white">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Video consultation will appear here</p>
                    <p className="text-sm opacity-75">Powered by LiveKit with AI translation</p>
                  </div>
                </div>
              )}

              {consultationMode === 'ai' && (
                <div className="space-y-4">
                  <div className="h-64 bg-white rounded-lg border-2 border-gray-300 p-4 overflow-y-auto">
                    {aiDoctorMessages.map((msg, index) => (
                      <div key={index} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-3 rounded-lg max-w-xs ${
                          msg.role === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 text-gray-800'
                        }`}>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Type your message or use voice..."
                      value={aiDoctorInput}
                      onChange={(e) => setAiDoctorInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAIDoctorMessage(aiDoctorInput)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAIDoctorSpeechToText}
                      className={`${isAiDoctorListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                      {isAiDoctorListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={() => handleAIDoctorMessage(aiDoctorInput)}
                      disabled={!aiDoctorInput.trim()}
                      className="bg-green-500 hover:bg-green-600"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`${isVideoOn ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className={`${isAudioOn ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  {isAiDoctorSpeaking && (
                    <div className="flex items-center text-purple-600">
                      <div className="animate-pulse w-2 h-2 bg-purple-600 rounded-full mr-1"></div>
                      <span className="text-sm">AI Speaking...</span>
                    </div>
                  )}
                </div>
                <Button
                  onClick={endConsultation}
                  className="bg-red-500 hover:bg-red-600"
                >
                  <PhoneOff className="w-4 h-4 mr-2" />
                  End Consultation
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Appointment History */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-gray-800">Appointment History</h4>
          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No consultations yet</p>
          ) : (
            appointments.map((appointment) => (
              <Card key={appointment.id} className="p-4 bg-white border-2 border-gray-200 hover:border-indigo-300 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">{appointment.doctor_name}</h4>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(appointment.scheduled_at).toLocaleDateString()} at{' '}
                      {new Date(appointment.scheduled_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border-2 ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800 border-green-300' :
                    appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                    'bg-gray-100 text-gray-800 border-gray-300'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                {appointment.notes && (
                  <p className="text-sm text-gray-600 mt-2">{appointment.notes}</p>
                )}
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );

  const renderMarketplace = () => (
    <div className="space-y-6">
      <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-emerald-500/30 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center text-gray-800">
            <ShoppingCart className="w-6 h-6 mr-2 text-emerald-600" />
            Health Marketplace
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrency('NGN')}
                className={`p-2 ${currency === 'NGN' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <MapPin className="w-4 h-4 mr-1" />
                🇳🇬 NGN
              </Button>
              <Button
                onClick={() => setCurrency('USD')}
                className={`p-2 ${currency === 'USD' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <Globe className="w-4 h-4 mr-1" />
                🇺🇸 USD
              </Button>
            </div>
            <Button
              onClick={() => setShowCart(!showCart)}
              className="bg-emerald-500 hover:bg-emerald-600 relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cart.length})
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {getCurrentPageItems().map((item: any) => (
            <Card key={item.id} className="p-4 bg-white border-2 border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full border">
                  {item.country === 'Nigeria' ? '🇳🇬' : '🇺🇸'}
                </span>
              </div>
              <p className="text-sm text-gray-600 capitalize mb-2">{item.category}</p>
              <p className="text-lg font-bold text-emerald-600 mb-3">
                {currency === 'NGN' ? `₦${item.price.toLocaleString()}` : `$${(item.priceUSD || item.price * 0.0024).toFixed(2)}`}
              </p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{width: '60px'}}>
                    <div 
                      className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-2 rounded-full" 
                      style={{width: `${item.popularity}%`}}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500">{item.popularity}%</span>
                </div>
              </div>
              <Button 
                onClick={() => addToCart(item)}
                size="sm" 
                className="w-full bg-emerald-500 hover:bg-emerald-600"
              >
                Add to Cart
              </Button>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Cart Modal */}
      {showCart && (
        <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-emerald-500/30 shadow-xl">
          <h4 className="text-lg font-semibold mb-4 text-gray-800">Shopping Cart</h4>
          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <h5 className="font-medium text-gray-800">{item.name}</h5>
                    <p className="text-sm text-gray-600">
                      {currency === 'NGN' ? `₦${item.price.toLocaleString()}` : `$${(item.priceUSD || item.price * 0.0024).toFixed(2)}`} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      size="sm"
                      className="ml-2 bg-red-500 hover:bg-red-600"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Delivery Details */}
              <div className="border-t pt-4">
                <h5 className="font-semibold text-gray-800 mb-3">Delivery Details</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Full Name"
                    value={deliveryDetails.name}
                    onChange={(e) => setDeliveryDetails(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={deliveryDetails.phone}
                    onChange={(e) => setDeliveryDetails(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Input
                    placeholder="Delivery Address"
                    value={deliveryDetails.address}
                    onChange={(e) => setDeliveryDetails(prev => ({ ...prev, address: e.target.value }))}
                    className="md:col-span-2"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800">
                    Total: {currency === 'NGN' ? '₦' : '$'}{getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button
                    onClick={handleCheckout}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Checkout with Paystack
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    variant="outline"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay with Stripe
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );

  const renderReportSummary = () => (
    <Card className="p-6 bg-white/80 backdrop-blur-lg border-4 border-cyan-500/30 shadow-xl">
      <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
        <FileText className="w-6 h-6 mr-2 text-cyan-600" />
        AI Health Report Summary
      </h3>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border-4 border-cyan-200">
          <p className="text-cyan-800 mb-4">Enter your current health vitals to generate a comprehensive health summary</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
              <Input
                placeholder="e.g., 120/80"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="text-gray-800 border-2 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
              <Input
                placeholder="e.g., 72"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                className="text-gray-800 border-2 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
              <Input
                placeholder="e.g., 98.6"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="text-gray-800 border-2 border-gray-300"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BMI</label>
              <Input
                placeholder="e.g., 22.5"
                value={bmi}
                onChange={(e) => setBmi(e.target.value)}
                className="text-gray-800 border-2 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Quality</label>
              <Input
                placeholder="e.g., Good, Fair, Poor"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                className="text-gray-800 border-2 border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
              <Input
                placeholder="e.g., Sedentary, Moderate, Active"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="text-gray-800 border-2 border-gray-300"
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleGenerateReportSummary} 
          disabled={isReportGenerating}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          {isReportGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Report...
            </>
          ) : (
            'Generate Health Summary'
          )}
        </Button>

        {reportSummary && (
          <Card className="p-4 bg-cyan-50 border-4 border-cyan-500/30">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-cyan-800">Health Summary Report:</h4>
              <Button
                onClick={() => handleCopy(reportSummary, 'report')}
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0"
              >
                {copiedStates.report ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">{reportSummary}</div>
          </Card>
        )}
      </div>
    </Card>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'symptoms', label: 'Symptom Checker', icon: Search },
    { id: 'photo', label: 'Photo Diagnosis', icon: Camera },
    { id: 'medication', label: 'Medication Check', icon: Pill },
    { id: 'terms', label: 'Medical Terms', icon: BookOpen },
    { id: 'report', label: 'Report Summary', icon: FileText },
    { id: 'coach', label: 'Health Coach', icon: Heart },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-64 bg-white/90 backdrop-blur-lg shadow-xl border-r-4 border-gray-200 flex flex-col">
          <div className="p-6 border-b-4 border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-800">{user?.email}</h2>
                <p className="text-sm text-gray-600">Patient</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-2 flex-grow">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105 border-2 border-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 hover:transform hover:scale-105 border-2 border-transparent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm lg:text-base">{tab.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 mt-auto">
            <Button
              onClick={handleSignOut}
              className="w-full px-2 py-2 text-xs lg:text-sm bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              size="sm"
            >
              <LogOut className="w-4 h-4 mr-1 lg:mr-2" />
              <span className="hidden lg:inline">Sign Out</span>
              <span className="lg:hidden">Out</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to MedSync AI
              </h1>
              <p className="text-gray-600 mt-2">Your AI-powered healthcare companion</p>
            </div>

            <div className="animate-fadeIn">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'symptoms' && renderSymptomChecker()}
              {activeTab === 'photo' && renderPhotodiagnosis()}
              {activeTab === 'medication' && renderMedicationCheck()}
              {activeTab === 'terms' && renderMedicalTerms()}
              {activeTab === 'report' && renderReportSummary()}
              {activeTab === 'coach' && renderHealthCoach()}
              {activeTab === 'appointments' && renderAppointments()}
              {activeTab === 'marketplace' && renderMarketplace()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}