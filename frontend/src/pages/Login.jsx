import { useState } from "react";
import { Container, Card, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import toast from "react-hot-toast";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        // OAuth2 expects form-urlencoded data
        const formData = new URLSearchParams();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const res = await api.post("/auth/token", formData, {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
            });
            localStorage.setItem("token", res.data.access_token);
            toast.success("Giriş başarılı!");
            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Giriş başarısız! TC No veya şifre hatalı.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <Card className="shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-4 text-primary">Doktor Girişi</h3>
                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label>TC Kimlik No</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="11 haneli TC No"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            maxLength="11"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Şifre</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                placeholder="Şifre"
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
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mb-3">
                        Giriş Yap
                    </Button>
                    <div className="text-center">
                        Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
                    </div>
                </Form>
            </Card>
        </Container>
    );
}

export default Login;
