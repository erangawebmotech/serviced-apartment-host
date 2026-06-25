import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import * as constants from "../../common/constants";
import { Cookies } from "typescript-cookie";
import { checkAuthenticationViaAuthUser } from '../../common/commonFunctions';
import { AdminPanelRouteEnum } from '../../common/enums/adminPanelRouteEnum';

interface ReservationCancelModal {
    purpose: string;
}
const AdminPanelRouteHandler: React.FC<ReservationCancelModal> = ({
    purpose,
}) => {
    const history = useNavigate();
    const { propertyId } = useParams();
    useEffect(() => {

        // console.log("Received param:", propertyId, typeof propertyId);
        const propertyIDNum = parseInt(propertyId ? propertyId : "")
        //    console.log("propertyIDNum:", propertyIDNum, typeof propertyIDNum);


        Cookies.remove(constants.PROPERTY_ID);
        Cookies.remove(constants.PLAN_ID);
        Cookies.remove(constants.ROOM_ID);
        Cookies.remove(constants.LOCATION_OBJECT);

        let url = window.location.href;
        const parsedUrl = new URL(url);
        const isLocalhost = parsedUrl.hostname === "localhost";

        Cookies.remove(constants.ACCESS_TOKEN_HOST, {
            domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
            path: "/",
        });

        Cookies.remove(constants.REFRESH_TOKEN_HOST, {
            domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
            path: "/",
        });

        Cookies.remove(constants.AUTH_USER_HOST, {
            domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
            path: "/",
        });

        const isUserLogin = Cookies.get(constants.AUTH_USER_HOST);

        if (!checkAuthenticationViaAuthUser()) {
            history("/login");
        } else {
            purpose === AdminPanelRouteEnum.ADMIN_PROPERTY_LISTING ?
                history("/admin-property-listings")
                : purpose === AdminPanelRouteEnum.ADMIN_PROPERTY_EDIT ?
                    history(`/main/finish/${propertyIDNum}`)
                    : purpose === AdminPanelRouteEnum.ADMIN_CALENDAR_REDIRECT
                        ? history("/calendar", {
                            state: { propertyId: propertyIDNum },
                        })
                        : ""
        }

    }, [history]);


    return null; // No UI
};

export default AdminPanelRouteHandler
