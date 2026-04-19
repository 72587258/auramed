import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaHeartbeat, FaArrowLeft, FaNotesMedical } from 'react-icons/fa';
import './DiagnosisResult.css';

export default function DiagnosisResult() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Safely retrieve the report from navigation state
    const report = location.state?.report;

    if (!report) {
        return (
            <div className="diagnosis-container text-center">
                <h2>No data found. Please run the symptom checker first.</h2>
                <button className="btn-secondary mt-5" onClick={() => navigate('/symptom-checker')}>Go Back</button>
            </div>
        );
    }

    const getSeverityColor = (sev) => {
        if (sev === 'High' || sev === 'Critical') return '#ef4444'; // red
        if (sev === 'Medium') return '#eab308'; // yellow
        return '#22c55e'; // green
    };

    return (
        <div className="diagnosis-container font-sans">
            <button className="back-btn" onClick={() => navigate('/profile')}><FaArrowLeft className="inline mr-2" /> View Dashboard</button>
            
            <motion.div 
                className="result-box"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="result-header">
                    <FaHeartbeat className="header-icon pulse" />
                    <h2>AI Diagnostic Analysis</h2>
                    <p>Based on your reported symptoms: <strong>{report.symptoms?.join(", ") || "Biometric Data N/A"}</strong></p>
                </div>

                <div className="diseases-section mt-8">
                    <h3 className="section-title"><FaNotesMedical className="inline mr-2" /> Possible Conditions</h3>
                    <div className="diseases-list">
                        {report.possibleDiseases?.map((disease, idx) => (
                            <motion.div 
                                key={idx} 
                                className="disease-card"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 * idx }}
                            >
                                <div className="disease-info">
                                    <h4>{disease.name}</h4>
                                    <span style={{ color: getSeverityColor(disease.severity) }} className="severity-badge">
                                        Severity: {disease.severity}
                                    </span>
                                </div>
                                <div className="prob-wrapper">
                                    <div className="prob-bar-container">
                                        <motion.div 
                                            className="prob-bar-fill"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${disease.probability}%` }}
                                            transition={{ delay: 0.6, duration: 1 }}
                                            style={{ backgroundColor: getSeverityColor(disease.severity) }}
                                        ></motion.div>
                                    </div>
                                    <span className="prob-text">{disease.probability}% Match</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div 
                    className="advice-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                >
                    <h3>AI Recommendation</h3>
                    <p>{report.advice}</p>
                </motion.div>

                <div className="disclaimer mt-8 flex items-center gap-3">
                    <FaExclamationTriangle className="text-yellow-500 text-2xl" />
                    <p className="text-sm text-slate-400 text-left">
                        <strong>Disclaimer:</strong> This is an AI-generated analysis and does not constitute professional medical advice. Always consult with a certified healthcare provider or call emergency services for definitive diagnosis and treatment.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
