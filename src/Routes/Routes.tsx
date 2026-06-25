// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { lazy } from "react";

const Routes = [
  {
    path: "/start",
    component: lazy(
      () => import("../components/propertyListingSteps/StepGetStart")
    ),
  },
  {
    path: "/property/01",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepNameOfProperty"
        )
    ),
  },
  {
    path: "/property/02/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepPlaceLocation"
        )
    ),
  },
  {
    path: "/property/03/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepConfirmAddress"
        )
    ),
  },

  {
    path: "/property/04/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepNameOfPlace"
        )
    ),
  },
  {
    path: "/property/05/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepBookingPlan"
        )
    ),
  },
  {
    path: "/property/06/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepPricePerNightToEntireProperty"
        )
    ),
  },
  {
    path: "/property/07/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepRatePlanForProperty"
        )
    ),
  },
  {
    path: "/property/08/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepEntirePropertyBathRoomDetails"
        )
    ),
  },

  {
    path: "/property/09/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepPoliciesOfProperty"
        )
    ),
  },
  {
    path: "/property/10/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepLanguagesStaffSpeaks"
        )
    ),
  },
  {
    path: "/property/11/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepParkingSlot"
        )
    ),
  },
  {
    path: "/property/12/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepDescribeApartment"
        )
    ),
  },
  {
    path: "/property/13/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepEntirePropertyHighlights"
        )
    ),
  },
  {
    path: "/property/14/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/propertyDetailsSteps/StepNewListingDiscount"
        )
    ),
  },

  {
    path: "/unit/01/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/roomDetailsSteps/StepRoomDetails"
        )
    ),
  },
  {
    path: "/unit/02/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/roomDetailsSteps/StepSimplifyRoomDetails"
        )
    ),
  },
  {
    path: "/image/01/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/imageDetailsSteps/StepGuestHouseImages"
        )
    ),
  },

  {
    path: "/final/01/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/finalSteps/StepCollectPayments"
        )
    ),
  },
  {
    path: "/final/02/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/finalSteps/StepCancellationPolicy"
        )
    ),
  },
  {
    path: "/final/03/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/finalSteps/StepNameAppearOnTheInvoice"
        )
    ),
  },
  {
    path: "/final/04/:propertyId",
    component: lazy(
      () =>
        import(
          "../components/propertyListingSteps/finalSteps/StepImportantInfo"
        )
    ),
  },
  {
    path: "/main/finish/:propertyId",
    component: lazy(() => import("../pages/MainStepsFinishPage")),
  },
  {
    path: "/complete/:propertyId",
    component: lazy(() => import("../pages/CompleteProcess")),
  },
  {
    path: "/listed-properties",
    component: lazy(() => import("../pages/ListeningProcess")),
  },
  {
    path: "/draft-listing",
    component: lazy(
      () => import("../components/propertyListingSteps/DraftListingPage")
    ),
  },
  {
    path: "/plan-selection",
    component: lazy(
      () => import("../components/propertyListingSteps/PlanSelectionPage")
    ),
  },
  {
    path: "/admin-property-listings",
    component: lazy(
      () => import("../components/propertyListingSteps/AdminPlanSelectionPage")
    ),
  },
  {
    path: "/not-found",
    component: lazy(() => import("../pages/NotFoundPage")),
  },
  {
    path: "/coming-soon",
    component: lazy(() => import("../pages/ComingSoonPage")),
  },
  {
    path: "/view/:propertyId",
    component: lazy(() => import("../pages/PropertyViewPage")),
  },
  {
    path: "/login",
    component: lazy(() => import("../pages/HostLoginPage")),
  },
  {
    path: "/sign-up",
    component: lazy(() => import("../pages/HostSignUpPage")),
  },
  {
    path: "/calendar",
    component: lazy(() => import("../pages/CalendarPage")),
  },
  {
    path: "/terms-and-conditions",
    component: lazy(() => import("../pages/TermsAndConditionsPage")),
  },
  {
    path: "/privacy-policy",
    component: lazy(() => import("../pages/PrivacyPolicyPage")),
  },
  {
    path: "/reservation-manage",
    component: lazy(() => import("../pages/ReservationManagementPage")),
  },
  {
    path: "/view-reservation/:reservationCode",
    component: lazy(() => import("../pages/ViewReservationPage")),
  },
  {
    path: "/earnings-manage",
    component: lazy(() => import("../pages/EarningsManagementPage")),
  },
  {
    path: "/synchronize/:propertyId",
    component: lazy(() => import("../pages/SynchronizePage")),
  },
  {
    path: "/profile",
    component: lazy(() => import("../pages/ProfilePage")),
  },
  {
    path: "/dashboard",
    component: lazy(() => import("../pages/DashboardPage")),
  },
  {
    path: "/reset-password",
    component: lazy(() => import("../pages/FirstTimeLoginPasswordResetPage")),
  },
  {
    path: "/forget-password",
    component: lazy(() => import("../pages/ForgetPasswordPage")),
  },
  {
    path: "/about-us",
    component: lazy(() => import("../pages/AboutUsPage")),
  },
];

export default Routes;
