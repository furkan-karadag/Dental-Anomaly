import { Nav, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BoxArrowRight, PersonCircle, HouseDoor, People } from "react-bootstrap-icons";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        if (window.confirm("Çıkış yapmak istediğinize emin misiniz?")) {
            localStorage.removeItem("token");
            navigate("/login");
        }
    };

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 bg-white border-end" style={{ width: "250px", minHeight: "100vh" }}>
            <Link to="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                <span className="fs-2 me-2">🦷</span>
                <span className="fs-4 fw-bold text-primary">DENTAI</span>
            </Link>
            <hr />
            <Nav variant="pills" className="flex-column mb-auto">
                <Nav.Item>
                    <Nav.Link as={Link} to="/" active={isActive("/")} className={isActive("/") ? "active" : "link-dark"}>
                        <HouseDoor className="bi me-2" size={18} />
                        Ana Sayfa
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/patients" active={isActive("/patients")} className={isActive("/patients") ? "active" : "link-dark"}>
                        <People className="bi me-2" size={18} />
                        Hastalarım
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/profile" active={isActive("/profile")} className={isActive("/profile") ? "active" : "link-dark"}>
                        <PersonCircle className="bi me-2" size={18} />
                        Profilim
                    </Nav.Link>
                </Nav.Item>
            </Nav>
            <hr />
            <div>
                <Button variant="outline-danger" size="sm" onClick={handleLogout} className="w-100 d-flex align-items-center justify-content-center gap-2">
                    <BoxArrowRight /> Çıkış Yap
                </Button>
            </div>
        </div>
    );
}

export default Sidebar;
