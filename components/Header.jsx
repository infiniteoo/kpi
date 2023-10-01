import styled from "@emotion/styled";
import Image from "next/image";
import logo from "../public/keyperformance.png";
import UploadCSV from "./UploadCSV";

const Navbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 50px;
  background-color: #ffffff;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: auto;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover img {
    transform: scale(1.05);
  }
`;

const Logo = styled(Image)`
  border-radius: 10px;
  transition: transform 0.3s ease-in-out;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  font-size: 16px;
`;

const Header = () => {
  return (
    <Navbar>
      <LogoContainer>
        <div style={{ width: "120px", height: "auto" }}>
          <Logo src={logo} alt="Logo" />
        </div>
      </LogoContainer>
      <UploadCSV />
      <NavLinks>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </NavLinks>
    </Navbar>
  );
};

export default Header;
