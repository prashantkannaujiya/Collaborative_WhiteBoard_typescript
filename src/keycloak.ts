import Keycloak from "keycloak-js";
const keycloak:any = new Keycloak({
 url: "http://localhost:8080/auth",
 realm: "keycloak-react-app",
 clientId: "react-app",
});

export default keycloak;