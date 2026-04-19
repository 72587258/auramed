import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import MedicationTracker from "./components/MedicationTracker";
import MedicalVault from "./components/MedicalVault";
import SymptomChecker from "./components/SymptomChecker";
import DiagnosisResult from "./components/DiagnosisResult";

import MentalHealth from "./components/MentalHealth";
import DoctorFinder from "./components/DoctorFinder";
import DeviceSync from "./components/DeviceSync";
import DietTracker from "./components/DietTracker";
import AdminPanel from "./components/AdminPanel";
import DNAScanner from "./components/DNAScanner";
import MentalZen from "./components/MentalZen";
import TeleConsult from "./components/TeleConsult";
import AIAssistant from "./components/AIAssistant";
import QuantumScheduler from "./components/QuantumScheduler";
import HealthNexus from "./components/HealthNexus";
import BioAchievements from "./components/BioAchievements";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/medications" element={<MedicationTracker />} />
        <Route path="/vault" element={<MedicalVault />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/diagnosis-result" element={<DiagnosisResult />} />
        <Route path="/mental-health" element={<MentalHealth />} />
        <Route path="/doctors" element={<DoctorFinder />} />
        <Route path="/sync" element={<DeviceSync />} />
        <Route path="/diet" element={<DietTracker />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/dna-scan" element={<DNAScanner />} />
        <Route path="/mental-zen" element={<MentalZen />} />
        <Route path="/teleconsult" element={<TeleConsult />} />
        <Route path="/neural-uplink" element={<AIAssistant />} />
        <Route path="/scheduler" element={<QuantumScheduler />} />
        <Route path="/nexus" element={<HealthNexus />} />
        <Route path="/achievements" element={<BioAchievements />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;