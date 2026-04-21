import { useState, useEffect } from "react";
import api from "../api";
import { Container, Card, ListGroup, Button } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async () => {
        try {
            const res = await api.get("/users/me");
            setUser(res.data);
        } catch (error) {
            console.error("Kullanıcı bilgisi alınamadı");
        }
    }

    return (
        <Container className="py-5" style={{ maxWidth: "600px" }}>
            <Card className="border-0 shadow-sm text-center p-4">
                <Card.Body>
                    <PersonCircle size={80} className="text-primary mb-3" />
                    <h2 className="fw-bold mb-1">
                        {user ? `${user.ad || ''} ${user.soyad || ''}` : "Yükleniyor..."}
                    </h2>
                    <p className="text-muted mb-4">{user ? user.username : ""}</p>

                    <Card className="text-start bg-light border-0">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                                <h6 className="fw-bold mb-0">Hesap Bilgileri</h6>
                                {editMode && <span className="badge bg-warning text-dark">Düzenleniyor</span>}
                            </div>

                            <ListGroup variant="flush" className="bg-transparent">
                                <ListGroup.Item className="bg-transparent d-flex justify-content-between px-0 align-items-center">
                                    <span className="text-muted">Ad</span>
                                    {editMode ? (
                                        <input className="form-control form-control-sm w-50" value={formData.ad} onChange={e => setFormData({ ...formData, ad: e.target.value })} />
                                    ) : (
                                        <span className="fw-medium">{user?.ad}</span>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item className="bg-transparent d-flex justify-content-between px-0 align-items-center">
                                    <span className="text-muted">Soyad</span>
                                    {editMode ? (
                                        <input className="form-control form-control-sm w-50" value={formData.soyad} onChange={e => setFormData({ ...formData, soyad: e.target.value })} />
                                    ) : (
                                        <span className="fw-medium">{user?.soyad}</span>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item className="bg-transparent d-flex justify-content-between px-0">
                                    <span className="text-muted">TC Kimlik No</span>
                                    <span className="fw-medium">{user?.username}</span>
                                </ListGroup.Item>
                                <ListGroup.Item className="bg-transparent d-flex justify-content-between px-0">
                                    <span className="text-muted">Ünvan</span>
                                    <span className="fw-medium">Diş Hekimi</span>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    <div className="mt-4">
                        {editMode ? (
                            <>
                                <Button variant="success" className="me-2" onClick={handleSave}>Kaydet</Button>
                                <Button variant="secondary" onClick={() => { setEditMode(false); setFormData({ ad: user.ad, soyad: user.soyad }) }}>İptal</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline-primary" className="me-2" onClick={() => setEditMode(true)}>Bilgileri Düzenle</Button>
                                <Button variant="outline-secondary">Şifre Değiştir</Button>
                            </>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Profile;
