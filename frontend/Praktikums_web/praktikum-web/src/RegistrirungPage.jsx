import './style.css'
import { useState } from 'react'


function RegistrirungPage() {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });

    // Änderungen an den Feldern erfassen
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Aktion beim Abschicken
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Die Passwörter stimmen nicht überein!");
            return;
        }
        console.log("Registrierungsdaten:", formData);
        alert("Registrierung erfolgreich (Test)!");

        if (formData.password.length < 8) {
            alert("Das Password ist zu kurz!");
            return;
        }
    };


    return (
        <div><h1>Test test</h1></div>




    )
}

export default RegistrirungPage