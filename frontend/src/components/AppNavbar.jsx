import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BoxArrowRight, PersonCircle, HouseDoor, People } from "react-bootstrap-icons";

function AppNavbar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Basit bir aktif link belirteci
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    return (
        <Navbar bg="white" expand="lg" className="border-bottom shadow-sm mb-4 py-3">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold text-primary">
                    <span style={{ fontSize: "1.5rem" }}>🦷</span>
                    <span>DENTAI</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto ms-4">
                        <Nav.Link as={Link} to="/" active={isActive("/")} className="d-flex align-items-center gap-2">
                            <HouseDoor size={18} /> Ana Sayfa
                        </Nav.Link>
                        <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-2">
                            <People size={18} /> Hastalarım
                        </Nav.Link>
                    </Nav>
                    <Nav className="align-items-center gap-3">
                        <Nav.Link as={Link} to="/profile" active={isActive("/profile")} className="d-flex align-items-center gap-2 text-dark">
                            <PersonCircle size={20} className="text-primary" />
                            <span>Profilim</span>
                        </Nav.Link>
                        <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center gap-2">
                            <BoxArrowRight /> Çıkış
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;
