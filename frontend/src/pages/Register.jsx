import { useState } from "react";
import { Container, Card, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import toast from "react-hot-toast";

function Register() {
    const [ad, setAd] = useState("");
    const [soyad, setSoyad] = useState("");
    const [tcNo, setTcNo] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validatePassword = (pass) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        return regex.test(pass);
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            toast.error("Şifre en az 6 karakter olmalı, en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir.");
            return;
        }

        const formData = new FormData();
        formData.append("ad", ad);
        formData.append("soyad", soyad);
        formData.append("tc_no", tcNo);
        formData.append("password", password);

        try {
            await api.post("/auth/kayit", formData);
            toast.success("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            console.error("Kayıt Hatası:", err);
            if (err.response) {
                toast.error(`Hata: ${err.response.data.detail || "Kayıt işlemini gerçekleştirilemedi."}`);
            } else if (err.request) {
                toast.error("Sunucuya ulaşılamıyor. Lütfen backend'in çalıştığından emin olun.");
            } else {
                toast.error("Bir hata oluştu: " + err.message);
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Card className="shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-4 text-success">Doktor Kaydı</h3>
                <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                        <Form.Label>Ad</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Adınız"
                            value={ad}
                            onChange={(e) => setAd(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Soyad</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Soyadınız"
                            value={soyad}
                            onChange={(e) => setSoyad(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>TC Kimlik No</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="11 haneli TC No"
                            value={tcNo}
                            onChange={(e) => setTcNo(e.target.value)}
                            required
                            maxLength="11"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Şifre</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Örn: Doktor1"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                            </Button>
                        </InputGroup>
                        <Form.Text className="text-muted small">
                            En az 6 karakter, 1 büyük, 1 küçük harf ve 1 rakam.
                        </Form.Text>
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100 mb-3">
                        Kayıt Ol
                    </Button>
                    <div className="text-center">
                        Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
                    </div>
                </Form>
            </Card>
        </Container>
    );
}

export default Register;
