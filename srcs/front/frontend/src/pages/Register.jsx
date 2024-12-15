import Form from "../components/Form"
import {useNavigate} from "react-router-dom"
import Snowfall from 'react-snowfall'

function Register() {

    const navigate = useNavigate();

    const handleGoToLoginButton = () => {
        localStorage.clear();
        navigate("/login")
    }

    return (
        <div>
             <Snowfall />
            <div className="div-login-page">
                <Snowfall />
                {localStorage.clear()}
                <Form route="/api/user/register/" method="register" />
                <button className="go-to-login-button" onClick={() => handleGoToLoginButton()}>Already have an account ?</button>
            </div>
        </div>
    );
}

export default Register