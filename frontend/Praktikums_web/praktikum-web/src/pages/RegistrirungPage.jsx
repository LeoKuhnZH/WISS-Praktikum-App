import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//Token
function RegistrirungPage() {
    const navigate = useNavigate();

    // Nur noch ein zentraler State für alle Formulardaten
    const [formData, setFormData] = useState({
        email:'',
        username: '',
        password: '',
        rememberMe: false
    });

    const [error, setError] = useState('');

    // Die Live-Validierung greift jetzt direkt auf formData.password zu!
    const hasLength = formData.password.length >= 8;
    const hasLower = /[a-z]/.test(formData.password);
    const hasUpper = /[A-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);

    // Prüft, ob alle Kriterien erfüllt sind
    const isPasswordValid = hasLength && hasLower && hasUpper && hasNumber;

}