import { PlansEnum } from "../enums/plansEnum";
import starterPlan from "../../assets/images/plans/starter.png";
import allInclusivePlan from "../../assets/images/plans/allInclusive.png";
import supportivePlan from "../../assets/images/plans/supportive.png";

export const LISTING_PLANS = [
    {
        plan: PlansEnum.STARTER,
        name: 'Starter',
        tagLine: 'Listing Only',
        features: [
            "Self-manage your property",
            "Direct guest bookings",
            "Low commission fees",
            "Full control of operations",
            "Ideal for independent hosts"
        ],
        image: {
            href: starterPlan,
            alt: 'Starter Plan',
        },
        buttonDetails: {
            label: 'Select Starter Plan',
        }
    },
    {
        plan: PlansEnum.SUPPORTIVE,
        name: 'Supportive',
        tagLine: 'Reservation Management',
        features: [
            "We create your listing",
            "Marketing & promotions included",
            "We handle bookings",
            "You manage guest hosting",
            "Moderate commission"
        ],
        image: {
            href: supportivePlan,
            alt: 'Supportive Plan',
        },
        buttonDetails: {
            label: 'Select Supportive Plan',
        }
    },
    {
        plan: PlansEnum.ALL_INCLUSIVE,
        name: 'All-Inclusive',
        tagLine: 'Full Service',
        features: [
            "Full property management",
            "On-site maintenance & cleaning",
            "Guest services provided",
            "End-to-end marketing & bookings",
            "Revenue share model"
        ],
        image: {
            href: allInclusivePlan,
            alt: 'All-Inclusive Plan',
        },
        buttonDetails: {
            label: 'Select Al Inclusive Plan',
        }
    },
]
// export const LISTING_PLANS = [
//     {
//         plan: PlansEnum.STARTER,
//         name: 'Starter',
//         tagLine: 'Listing Only',
//         description: 'For property owners who prefer self-hosting with minimal commission fees.',
//         features: [
//             {
//                 title: 'Self-managed listing',
//                 description: 'You handle everything, from marketing to promotions.',
//             },
//             {
//                 title: 'Direct bookings',
//                 description: 'Manage guest inquiries, pricing, and reservations independently.',
//             },
//             {
//                 title: 'Low commission',
//                 description: 'Serviced Apartments takes a small commission per booking.',
//             },
//             {
//                 title: 'Full control',
//                 description: 'You oversee guest communication, check-ins, and on-site management.',
//             }
//         ],
//         image: {
//             href: starterPlan,
//             alt: 'Starter Plan',
//         },
//         otherDetails: 'Perfect for independent hosts who want full control over their property.',
//         buttonDetails: {
//             label: 'Select Starter Plan',
//         }
//     },
//     {
//         plan: PlansEnum.SUPPORTIVE,
//         name: 'Supportive',
//         tagLine: 'Reservation Management',
//         description: 'For hosts who need expert marketing and reservation handling but manage guests on-site.',
//         features: [
//             {
//                 title: 'Property listing assistance',
//                 description: 'Submit an inquiry, and we’ll create a professional listing for you.',
//             },
//             {
//                 title: 'Marketing & promotion',
//                 description: 'We take care of advertising your property to maximize visibility.',
//             },
//             {
//                 title: 'Reservation management',
//                 description: 'Our team handles bookings and guest coordination.',
//             },
//             {
//                 title: 'Guest hosting by you',
//                 description: 'You manage the guest experience upon arrival.',
//             },
//             {
//                 title: 'Moderate commission',
//                 description: 'Higher than the Starter Plan but includes promotional support.',
//             }
//         ],
//         image: {
//             href: supportivePlan,
//             alt: 'Supportive Plan',
//         },
//         otherDetails: 'Best for hosts who want to boost occupancy without handling reservations.',
//         buttonDetails: {
//             label: 'Select Supportive Plan',
//         }
//     },
//     {
//         plan: PlansEnum.ALL_INCLUSIVE,
//         name: 'All-Inclusive',
//         tagLine: 'Full Service',
//         description: 'For property owners who want a hassle-free, fully managed hosting experience.',
//         features: [
//             {
//                 title: 'End-to-end management',
//                 description: 'We handle everything from listing to guest hosting.',
//             },
//             {
//                 title: 'Physical property management',
//                 description: 'Cleaning, maintenance, and on-site services included.',
//             },
//             {
//                 title: 'Professional guest service',
//                 description: 'Our team ensures a premium experience for guests.',
//             },
//             {
//                 title: 'Marketing & bookings',
//                 description: 'We maximize your earnings with full-service promotion.',
//             },
//             {
//                 title: 'Revenue share model',
//                 description: 'You earn a commission as the property owner.',
//             }
//         ],
//         image: {
//             href: allInclusivePlan,
//             alt: 'All-Inclusive Plan',
//         },
//         otherDetails: 'Ideal for owners who want passive income while we manage their property.',
//         buttonDetails: {
//             label: 'Select Al Inclusive Plan',
//         }
//     },
// ]