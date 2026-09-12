import { useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import en from "./locales/en.json";
import ne from "./locales/ne.json";

function flattenPairs(enNode, neNode, pairs = new Map()) {
  if (!enNode || !neNode) return pairs;

  if (typeof enNode === "string" && typeof neNode === "string") {
    pairs.set(enNode, neNode);
    return pairs;
  }

  if (typeof enNode === "object" && typeof neNode === "object") {
    for (const key of Object.keys(enNode)) {
      flattenPairs(enNode[key], neNode[key], pairs);
    }
  }

  return pairs;
}

const legacyUiTranslations = {
  "Find your next place": "आफ्नो अर्को बस्ने ठाउँ खोज्नुहोस्",
  "A better way to rent in Kathmandu.":
    "काठमाडौंमा भाडाको घर खोज्ने अझ सहज तरिका।",
  "Browse homes around the valley with location, pricing and property details in one place.":
    "उपत्यकाभरिका घरहरू स्थान, मूल्य र सम्पत्तिको विवरणसहित एउटै ठाउँमा हेर्नुहोस्।",
  "Explore rentals": "भाडाका घरहरू खोज्नुहोस्",
  "Kathmandu Valley": "काठमाडौं उपत्यका",
  "Rental search for the Kathmandu valley, built around the map — find a place, not just a listing.":
    "काठमाडौं उपत्यकामा नक्सामै केन्द्रित भाडा खोज — केवल लिस्टिङ होइन, उपयुक्त ठाउँ खोज्नुहोस्।",
  "Built in Kathmandu.": "काठमाडौंमा निर्माण गरिएको।",
  "Popular areas": "लोकप्रिय क्षेत्रहरू",
  Company: "कम्पनी",
  Support: "सहायता",
  "View source": "स्रोत हेर्नुहोस्",
  "Help center": "सहायता केन्द्र",
  "Privacy policy": "गोपनीयता नीति",
  "Terms of service": "सेवाका सर्तहरू",
  About: "हाम्रो बारेमा",
  "How it works": "यसले कसरी काम गर्छ",
  "List your property": "आफ्नो सम्पत्ति सूचीबद्ध गर्नुहोस्",

  "For renters": "भाडावालाका लागि",
  "Find a place, not just a listing.":
    "केवल लिस्टिङ होइन, बस्न मिल्ने ठाउँ खोज्नुहोस्।",
  "Browse homes across Kathmandu Valley with clear pricing, useful photos and the location information you actually need.":
    "स्पष्ट मूल्य, उपयोगी फोटो र आवश्यक स्थान जानकारीसहित काठमाडौं उपत्यकाभरिका घरहरू हेर्नुहोस्।",
  "For owners": "घरधनीका लागि",
  "List once. Reach real renters.":
    "एक पटक सूचीबद्ध गर्नुहोस्। वास्तविक भाडावालासम्म पुग्नुहोस्।",
  "Publish a property in minutes and manage renter interest directly from one simple workspace.":
    "केही मिनेटमै सम्पत्ति प्रकाशित गर्नुहोस् र एउटै सरल कार्यस्थानबाट भाडावालाको रुचि व्यवस्थापन गर्नुहोस्।",
  "Built for clarity": "स्पष्टताका लागि बनाइएको",
  "Less guesswork. More confidence.": "कम अनुमान। बढी विश्वास।",
  "See the details that matter before you visit — pricing, amenities, photos and property information in one place.":
    "भेट्नुअघि आवश्यक विवरणहरू — मूल्य, सुविधा, फोटो र सम्पत्तिको जानकारी एउटै ठाउँमा हेर्नुहोस्।",
  "Verified listings": "प्रमाणित लिस्टिङहरू",
  "Clear property details": "स्पष्ट सम्पत्ति विवरण",
  "Map-first search": "नक्सा-केन्द्रित खोज",
  "Explore by neighborhood": "क्षेत्रअनुसार खोज्नुहोस्",
  "Direct renting": "प्रत्यक्ष भाडा",
  "Connect without middlemen": "बिचौलियाबिनै सम्पर्क गर्नुहोस्",
  "Same city. New beginnings.": "उही सहर। नयाँ सुरुवात।",
  "Find a place that feels like home.": "घरजस्तै महसुस हुने ठाउँ खोज्नुहोस्।",
  "Create one account to search verified homes, save favourites and manage your rental journey without the usual clutter.":
    "एउटै खाता बनाएर प्रमाणित घरहरू खोज्नुहोस्, मनपरेका सुरक्षित गर्नुहोस् र सजिलै आफ्नो भाडा यात्रा व्यवस्थापन गर्नुहोस्।",
  "Better rooms. Brighter days.": "राम्रो कोठा। उज्यालो दिनहरू।",
  "A calmer way to rent in Kathmandu.": "काठमाडौंमा भाडा खोज्ने सहज तरिका।",
  "Good places start with a good search.":
    "राम्रो ठाउँको सुरुवात राम्रो खोजबाट हुन्छ।",
  "Welcome back to Rentora.": "Rentora मा फेरि स्वागत छ।",
  "Rentora account": "Rentora खाता",
  "By continuing, you agree to use Rentora responsibly and keep your account information secure.":
    "जारी राखेर, तपाईं Rentora जिम्मेवारीपूर्वक प्रयोग गर्न र आफ्नो खाता जानकारी सुरक्षित राख्न सहमत हुनुहुन्छ।",

  "Something went wrong": "केही समस्या भयो",
  "An unexpected error occurred.": "अप्रत्याशित त्रुटि भयो।",
  "Coming soon.": "चाँडै आउँदैछ।",
  Close: "बन्द गर्नुहोस्",
  "Hide password": "पासवर्ड लुकाउनुहोस्",
  "Show password": "पासवर्ड देखाउनुहोस्",

  "Email address": "इमेल ठेगाना",
  Password: "पासवर्ड",
  "Please check your details and try again.":
    "कृपया आफ्नो विवरण जाँचेर फेरि प्रयास गर्नुहोस्।",
  "Logging in...": "लगइन हुँदैछ...",
  "Log in": "लगइन गर्नुहोस्",
  "Full name": "पूरा नाम",
  "Phone number": "फोन नम्बर",
  "Minimum 6 characters": "कम्तीमा ६ अक्षर",
  "Creating account...": "खाता बनाउँदैछ...",
  "Create account": "खाता बनाउनुहोस्",
  "Please select both security questions.":
    "कृपया दुवै सुरक्षा प्रश्न छान्नुहोस्।",
  "Please choose two different security questions.":
    "कृपया दुई फरक सुरक्षा प्रश्न छान्नुहोस्।",
  "Please answer both security questions.":
    "कृपया दुवै सुरक्षा प्रश्नको उत्तर दिनुहोस्।",
  Renter: "भाडावाला",
  Owner: "घरधनी",
  "Find and save homes": "घर खोज्नुहोस् र सुरक्षित राख्नुहोस्",
  "List and manage property": "सम्पत्ति सूचीबद्ध र व्यवस्थापन गर्नुहोस्",
  "Account type": "खाता प्रकार",
  Answer: "उत्तर",
  "Couldn't load security questions.": "सुरक्षा प्रश्नहरू लोड गर्न सकिएन।",
  "Account recovery": "खाता पुनःप्राप्ति",
  "Choose two different questions you can answer later.":
    "पछि उत्तर दिन सक्ने दुई फरक प्रश्न छान्नुहोस्।",
  "Select a question": "प्रश्न छान्नुहोस्",
  "New password": "नयाँ पासवर्ड",
  "Confirm new password": "नयाँ पासवर्ड पुष्टि गर्नुहोस्",

  "Welcome back": "फेरि स्वागत छ",
  "Log in to continue to your Rentora account.":
    "आफ्नो Rentora खातामा जारी राख्न लगइन गर्नुहोस्।",
  "Don't have an account?": "खाता छैन?",
  "Sign up": "खाता बनाउनुहोस्",
  "Create your account": "आफ्नो खाता बनाउनुहोस्",
  "Choose how you'll use Rentora, then add your account details.":
    "Rentora कसरी प्रयोग गर्ने छान्नुहोस् र त्यसपछि आफ्नो खाता विवरण थप्नुहोस्।",
  "Already have an account?": "पहिले नै खाता छ?",
  "Enter the email on your account.": "आफ्नो खाताको इमेल प्रविष्ट गर्नुहोस्।",
  "Answer your security questions.":
    "आफ्ना सुरक्षा प्रश्नहरूको उत्तर दिनुहोस्।",
  "Choose a new password.": "नयाँ पासवर्ड छान्नुहोस्।",
  "All set.": "सबै तयार छ।",
  "Couldn't find an account with that email.":
    "त्यो इमेलसँग सम्बन्धित खाता फेला परेन।",
  "Those answers don't match our records.":
    "ती उत्तरहरू हाम्रो रेकर्डसँग मेल खाएनन्।",
  "Couldn't reset your password. Please start again.":
    "पासवर्ड रिसेट गर्न सकिएन। कृपया फेरि सुरु गर्नुहोस्।",
  "Reset password": "पासवर्ड रिसेट गर्नुहोस्",
  "Remembered it?": "पासवर्ड सम्झनुभयो?",
  "Back to login": "लगइनमा फर्कनुहोस्",
  Email: "इमेल",
  "Checking...": "जाँच हुँदैछ...",
  Continue: "जारी राख्नुहोस्",
  "Resetting...": "रिसेट हुँदैछ...",
  "Your password has been reset. You can log in with your new password now.":
    "तपाईंको पासवर्ड रिसेट भएको छ। अब नयाँ पासवर्डले लगइन गर्न सक्नुहुन्छ।",
  "Go to login": "लगइनमा जानुहोस्",
  "New passwords don't match.": "नयाँ पासवर्डहरू मेल खाएनन्।",
  "New password must be at least 6 characters.":
    "नयाँ पासवर्ड कम्तीमा ६ अक्षरको हुनुपर्छ।",

  "Step 01": "चरण ०१",
  "Step 02": "चरण ०२",
  "Step 03": "चरण ०३",
  "Step 04": "चरण ०४",
  "Property details": "सम्पत्ति विवरण",
  "Give renters the essential information they need at a glance.":
    "भाडावालालाई एक नजरमै आवश्यक मुख्य जानकारी दिनुहोस्।",
  Title: "शीर्षक",
  Description: "विवरण",
  "Title is required": "शीर्षक आवश्यक छ",
  "Description is required": "विवरण आवश्यक छ",
  "Describe the property, surroundings and anything renters should know...":
    "सम्पत्ति, वरपरको क्षेत्र र भाडावालाले जान्नुपर्ने अन्य कुरा वर्णन गर्नुहोस्...",
  "Listing type": "लिस्टिङ प्रकार",
  "Price (NPR / month)": "मूल्य (रु / महिना)",
  "Price is required": "मूल्य आवश्यक छ",
  "Price must be greater than 0": "मूल्य ० भन्दा बढी हुनुपर्छ",
  Location: "स्थान",
  "Set a clear address and pin the exact property location.":
    "स्पष्ट ठेगाना राख्नुहोस् र सम्पत्तिको ठ्याक्कै स्थान नक्सामा चिन्ह लगाउनुहोस्।",
  Address: "ठेगाना",
  "Address is required": "ठेगाना आवश्यक छ",
  "Pin the exact location": "ठ्याक्कै स्थान चिन्ह लगाउनुहोस्",
  "Property photos": "सम्पत्तिका फोटोहरू",
  "Add clear images that show the property accurately.":
    "सम्पत्ति स्पष्ट देखिने सफा फोटोहरू थप्नुहोस्।",
  Amenities: "सुविधाहरू",
  "Select everything that applies to this property.":
    "यो सम्पत्तिमा उपलब्ध सबै सुविधा छान्नुहोस्।",
  "Please drop a pin on the map to set the location":
    "स्थान सेट गर्न नक्सामा पिन राख्नुहोस्",
  "Add a clear title and description": "स्पष्ट शीर्षक र विवरण थप्नुहोस्",
  "Set the address and map pin": "ठेगाना र नक्सा पिन सेट गर्नुहोस्",
  "Enter the monthly rent": "मासिक भाडा प्रविष्ट गर्नुहोस्",
  "Upload useful property photos": "उपयोगी सम्पत्ति फोटोहरू अपलोड गर्नुहोस्",
  "Choose the available amenities": "उपलब्ध सुविधाहरू छान्नुहोस्",
  "Failed to create listing": "लिस्टिङ बनाउन सकिएन",
  "Publishing...": "प्रकाशित हुँदैछ...",
  "Publish listing": "लिस्टिङ प्रकाशित गर्नुहोस्",
  "Ready to publish": "प्रकाशित गर्न तयार",
  "Listing checklist": "लिस्टिङ जाँचसूची",
  "Your listing becomes visible after it has been successfully published.":
    "सफलतापूर्वक प्रकाशित भएपछि तपाईंको लिस्टिङ देखिन थाल्छ।",

  Any: "कुनै पनि",
  Apply: "लागू गर्नुहोस्",
  Area: "क्षेत्र",
  Region: "स्थान",
  "Search location in Nepal": "नेपालमा स्थान खोज्नुहोस्",
  "Clear search": "खोज हटाउनुहोस्",
  Min: "न्यूनतम",
  Max: "अधिकतम",
  "Search a place in Nepal...": "नेपालमा ठाउँ खोज्नुहोस्...",
  "Geolocation isn't supported by your browser":
    "तपाईंको ब्राउजरले स्थान पहिचान समर्थन गर्दैन",
  "Couldn't get your location. Check browser permissions.":
    "तपाईंको स्थान प्राप्त गर्न सकिएन। ब्राउजर अनुमति जाँच्नुहोस्।",
  "Search above, use your current location, or click on the map to drop a pin.":
    "माथि खोज्नुहोस्, हालको स्थान प्रयोग गर्नुहोस् वा नक्सामा क्लिक गरेर पिन राख्नुहोस्।",
  "Draw search area": "खोज क्षेत्र कोर्नुहोस्",
  "Clear search area": "खोज क्षेत्र हटाउनुहोस्",
  "Zoom in": "जुम इन गर्नुहोस्",
  "Zoom out": "जुम आउट गर्नुहोस्",
  "Cancel drawing": "रेखांकन रद्द गर्नुहोस्",
  "Click and drag to trace the area you want to search":
    "खोज्न चाहेको क्षेत्र कोर्न क्लिक गरी तान्नुहोस्",
  'Tip: use "Draw search area" to lasso any neighborhood':
    "सुझाव: कुनै क्षेत्र घेर्न ‘खोज क्षेत्र कोर्नुहोस्’ प्रयोग गर्नुहोस्",
  "Area selected — ready to search": "क्षेत्र चयन भयो — खोज्न तयार",
  "Search inside this area": "यो क्षेत्रमा खोज्नुहोस्",
  "Clear area": "क्षेत्र हटाउनुहोस्",
  "View details →": "विवरण हेर्नुहोस् →",

  "Upload failed": "अपलोड असफल भयो",
  "Remove photo": "फोटो हटाउनुहोस्",
  "Uploading photos...": "फोटोहरू अपलोड हुँदैछन्...",
  "Add property photos": "सम्पत्तिका फोटोहरू थप्नुहोस्",
  "Cover photo": "मुख्य फोटो",
  "Choose one or more images. The first photo will be shown as the cover.":
    "एक वा बढी फोटो छान्नुहोस्। पहिलो फोटो मुख्य फोटोको रूपमा देखाइनेछ।",
  "Browse files": "फाइलहरू छान्नुहोस्",
  "No photos available": "कुनै फोटो उपलब्ध छैन",
  "Go back": "पछाडि जानुहोस्",
  "Share listing": "लिस्टिङ सेयर गर्नुहोस्",
  Share: "सेयर",
  "Link copied": "लिङ्क प्रतिलिपि भयो",
  "Couldn't copy link": "लिङ्क प्रतिलिपि गर्न सकिएन",
  "More actions": "थप विकल्पहरू",
  "Copy link": "लिङ्क प्रतिलिपि गर्नुहोस्",
  "Open property": "सम्पत्ति खोल्नुहोस्",
  "View property": "सम्पत्ति हेर्नुहोस्",
  Rental: "भाडा",
  "Location unavailable": "स्थान उपलब्ध छैन",
  "Loading listings…": "लिस्टिङहरू लोड हुँदैछन्…",
  "No listings match your search yet.":
    "तपाईंको खोजसँग मेल खाने लिस्टिङ अहिलेसम्म छैन।",
  "No photo yet": "अहिलेसम्म फोटो छैन",
  "Selected rental": "चयन गरिएको भाडा",
  "/ month": "/ महिना",
  Explore: "खोज्नुहोस्",
  "More nearby": "नजिकका थप",
  "Most popular": "सबैभन्दा लोकप्रिय",

  "This property is currently rented and is not accepting visit requests.":
    "यो सम्पत्ति हाल भाडामा छ र अवलोकन अनुरोध स्वीकार गरिरहेको छैन।",
  "Couldn't send request. Please try again.":
    "अनुरोध पठाउन सकिएन। कृपया फेरि प्रयास गर्नुहोस्।",
  "Request sent": "अनुरोध पठाइयो",
  "Your visit request has been sent to the owner.":
    "तपाईंको अवलोकन अनुरोध घरधनीलाई पठाइएको छ।",
  "Request to visit": "हेर्न अनुरोध गर्नुहोस्",
  Date: "मिति",
  Time: "समय",
  "Message (optional)": "सन्देश (वैकल्पिक)",
  "Anything the owner should know...": "घरधनीले जान्नुपर्ने केही कुरा...",
  "Sending...": "पठाउँदैछ...",
  "Send request": "अनुरोध पठाउनुहोस्",
  "Property owner": "घरधनी",
  "Currently rented": "हाल भाडामा",
  "Remove from saved": "सुरक्षितबाट हटाउनुहोस्",
  "Save listing": "लिस्टिङ सुरक्षित गर्नुहोस्",
  "Request Visit": "अवलोकन अनुरोध गर्नुहोस्",
  Rented: "भाडामा दिइएको",
  Available: "उपलब्ध",
  "Property available": "सम्पत्ति उपलब्ध छ",
  "Contact owner": "घरधनीलाई सम्पर्क गर्नुहोस्",
  "This property has been marked as rented or filled by the owner. New visit requests are currently disabled.":
    "घरधनीले यो सम्पत्ति भाडामा गएको वा भरिएको भनेर चिन्ह लगाएका छन्। नयाँ अवलोकन अनुरोधहरू हाल बन्द छन्।",
  "/Month": "/महिना",
  Reviews: "समीक्षाहरू",
  "No reviews yet.": "अहिलेसम्म कुनै समीक्षा छैन।",
  Anonymous: "अज्ञात",
  "Delete your review": "आफ्नो समीक्षा मेटाउनुहोस्",
  "Write your reply...": "आफ्नो जवाफ लेख्नुहोस्...",
  "Saving...": "सुरक्षित हुँदैछ...",
  "Save reply": "जवाफ सुरक्षित गर्नुहोस्",
  Reply: "जवाफ दिनुहोस्",

  Overview: "अवलोकन",
  "My Listings": "मेरा लिस्टिङहरू",
  Messages: "सन्देशहरू",
  Favorites: "मनपर्ने",
  Settings: "सेटिङहरू",
  Discover: "खोज्नुहोस्",
  "Add Listing": "लिस्टिङ थप्नुहोस्",
  "Owner workspace": "घरधनी कार्यस्थान",
  "Property management": "सम्पत्ति व्यवस्थापन",
  "Listings & requests": "लिस्टिङ र अनुरोधहरू",
  "Review your properties and respond to renter visits.":
    "आफ्ना सम्पत्तिहरू हेर्नुहोस् र भाडावालाका अवलोकन अनुरोधमा प्रतिक्रिया दिनुहोस्।",
  "Manage your properties, review visit requests and keep track of renter activity.":
    "आफ्ना सम्पत्तिहरू व्यवस्थापन गर्नुहोस्, अवलोकन अनुरोधहरू समीक्षा गर्नुहोस् र भाडावालाको गतिविधि हेर्नुहोस्।",
  "New listing": "नयाँ लिस्टिङ",
  "Total listings": "कुल लिस्टिङहरू",
  "Properties you manage": "तपाईंले व्यवस्थापन गर्ने सम्पत्तिहरू",
  "Saved by renters": "भाडावालाले सुरक्षित गरेका",
  "Across your listings": "तपाईंका सबै लिस्टिङमा",
  "Visit requests": "अवलोकन अनुरोधहरू",
  "Loading activity": "गतिविधि लोड हुँदैछ",
  "Average rating": "औसत मूल्याङ्कन",
  "Across received reviews": "प्राप्त समीक्षाहरूमा",
  Listings: "लिस्टिङहरू",
  "Listing removed": "लिस्टिङ हटाइएको",
  "Untitled property": "शीर्षक नभएको सम्पत्ति",
  "Price not set": "मूल्य सेट गरिएको छैन",
  "Location not specified": "स्थान उल्लेख गरिएको छैन",
  "No listings yet": "अहिलेसम्म कुनै लिस्टिङ छैन",
  "Create your first property listing to start receiving renter interest and visit requests.":
    "भाडावालाको रुचि र अवलोकन अनुरोध प्राप्त गर्न आफ्नो पहिलो सम्पत्ति लिस्टिङ बनाउनुहोस्।",
  "Create your first listing": "पहिलो लिस्टिङ बनाउनुहोस्",
  "Couldn't load visit requests.": "अवलोकन अनुरोधहरू लोड गर्न सकिएन।",
  "No visit requests yet": "अहिलेसम्म कुनै अवलोकन अनुरोध छैन",
  "New renter requests will appear here.":
    "नयाँ भाडावाला अनुरोधहरू यहाँ देखिनेछन्।",
  "Visit activity": "अवलोकन गतिविधि",
  "Request overview": "अनुरोध अवलोकन",
  "Latest request": "पछिल्लो अनुरोध",
  "No visit activity yet.": "अहिलेसम्म कुनै अवलोकन गतिविधि छैन।",
  "Portfolio snapshot": "पोर्टफोलियो झलक",
  "Recently added": "भर्खरै थपिएका",
  "A quick look at your latest properties.":
    "तपाईंका नयाँ सम्पत्तिहरूको छोटो झलक।",
  "No properties yet": "अहिलेसम्म कुनै सम्पत्ति छैन",
  "Your latest listings will appear here after you publish them.":
    "प्रकाशित गरेपछि तपाईंका नयाँ लिस्टिङहरू यहाँ देखिनेछन्।",
  "Add listing": "लिस्टिङ थप्नुहोस्",
  Pending: "विचाराधीन",
  Accepted: "स्वीकार गरिएको",
  Declined: "अस्वीकार गरिएको",
  Accept: "स्वीकार गर्नुहोस्",
  Decline: "अस्वीकार गर्नुहोस्",
  Available: "उपलब्ध",
  "Rented / filled": "भाडामा / भरिएको",
  "Renters can request a visit.": "भाडावालाले अवलोकन अनुरोध गर्न सक्छन्।",
  "Visit requests are disabled.": "अवलोकन अनुरोधहरू बन्द छन्।",
  "Couldn't update availability. Please try again.":
    "उपलब्धता अद्यावधिक गर्न सकिएन। कृपया फेरि प्रयास गर्नुहोस्।",
  "Loading your listings...": "तपाईंका लिस्टिङहरू लोड हुँदैछन्...",
  "Couldn't load your listings.": "तपाईंका लिस्टिङहरू लोड गर्न सकिएन।",

  "Renter dashboard": "भाडावाला ड्यासबोर्ड",
  "Keep track of the places you've saved, your visit requests, and what you want to explore next.":
    "तपाईंले सुरक्षित गरेका ठाउँ, अवलोकन अनुरोध र अब खोज्न चाहेका ठाउँहरूको जानकारी राख्नुहोस्।",
  "Your activity": "तपाईंको गतिविधि",
  "Saved & requested": "सुरक्षित र अनुरोध गरिएका",
  "View saved": "सुरक्षित लिस्टिङ हेर्नुहोस्",
  "Saved listings": "सुरक्षित लिस्टिङहरू",
  "Properties you've kept for later.": "पछि हेर्न सुरक्षित राखेका सम्पत्तिहरू।",
  "Requests sent": "पठाइएका अनुरोधहरू",
  "Visit requests you've submitted.": "तपाईंले पठाएका अवलोकन अनुरोधहरू।",
  "Pending requests": "विचाराधीन अनुरोधहरू",
  "Waiting for an owner's response.": "घरधनीको जवाफको प्रतीक्षामा।",
  "Couldn't load your saved listings.":
    "तपाईंका सुरक्षित लिस्टिङहरू लोड गर्न सकिएन।",
  "No saved listings yet": "अहिलेसम्म कुनै सुरक्षित लिस्टिङ छैन",
  "Save properties while browsing and they'll appear here.":
    "खोज्दा सम्पत्तिहरू सुरक्षित गर्नुहोस्, ती यहाँ देखिनेछन्।",
  "Couldn't load your visit requests.":
    "तपाईंका अवलोकन अनुरोधहरू लोड गर्न सकिएन।",
  "No visit requests yet": "अहिलेसम्म कुनै अवलोकन अनुरोध छैन",
  "Your property visit requests will appear here.":
    "तपाईंका सम्पत्ति अवलोकन अनुरोधहरू यहाँ देखिनेछन्।",
  "Request status": "अनुरोध स्थिति",
  "Track what is happening with your property visits.":
    "तपाईंका सम्पत्ति अवलोकन अनुरोधहरूको अवस्था हेर्नुहोस्।",
  "No requests yet": "अहिलेसम्म कुनै अनुरोध छैन",
  "Your collection": "तपाईंको संग्रह",
  "Keep the places you like in one spot and come back when you're ready to compare, contact the owner, or arrange a visit.":
    "मनपरेका ठाउँहरू एउटै स्थानमा राख्नुहोस् र तुलना गर्न, घरधनीलाई सम्पर्क गर्न वा अवलोकन मिलाउन तयार हुँदा फेरि हेर्नुहोस्।",
  "A clean shortlist of the rentals you've marked for later.":
    "पछि हेर्न चिन्ह लगाएका भाडाका घरहरूको व्यवस्थित सूची।",
  "Tap the heart on any rental you like and it'll be added here.":
    "मनपरेको भाडा लिस्टिङमा मुटु चिन्ह थिच्नुहोस्, त्यो यहाँ थपिनेछ।",
  "Browse rentals": "भाडाका घरहरू हेर्नुहोस्",

  "Account settings": "खाता सेटिङहरू",
  "Manage your identity, profile photo and account security from one place.":
    "आफ्नो परिचय, प्रोफाइल फोटो र खाता सुरक्षा एउटै ठाउँबाट व्यवस्थापन गर्नुहोस्।",
  "Owner account": "घरधनी खाता",
  "Renter account": "भाडावाला खाता",
  Identity: "पहिचान",
  "Profile picture": "प्रोफाइल तस्वीर",
  "This photo appears alongside your account across Rentora.":
    "यो फोटो Rentora मा तपाईंको खातासँगै देखिन्छ।",
  Account: "खाता",
  "Personal information": "व्यक्तिगत जानकारी",
  "Keep your basic account information accurate and up to date.":
    "आफ्नो आधारभूत खाता जानकारी सही र अद्यावधिक राख्नुहोस्।",
  Security: "सुरक्षा",
  "Password & security": "पासवर्ड र सुरक्षा",
  "Choose a strong password that you don't use elsewhere.":
    "अन्यत्र प्रयोग नगरेको बलियो पासवर्ड छान्नुहोस्।",
  "Use a clear photo so your profile is easier to recognise.":
    "प्रोफाइल सजिलै चिन्न स्पष्ट फोटो प्रयोग गर्नुहोस्।",
  "Change photo": "फोटो परिवर्तन गर्नुहोस्",
  "Upload photo": "फोटो अपलोड गर्नुहोस्",
  "Save photo": "फोटो सुरक्षित गर्नुहोस्",
  Remove: "हटाउनुहोस्",
  "JPG or PNG · Maximum 5MB": "JPG वा PNG · अधिकतम 5MB",
  "Couldn't upload that photo.": "त्यो फोटो अपलोड गर्न सकिएन।",
  "Couldn't remove the photo.": "फोटो हटाउन सकिएन।",
  "Saved.": "सुरक्षित भयो।",
  "Couldn't save your changes.": "तपाईंका परिवर्तनहरू सुरक्षित गर्न सकिएन।",
  "Changes saved.": "परिवर्तनहरू सुरक्षित भए।",
  "Save changes": "परिवर्तन सुरक्षित गर्नुहोस्",
  "Current password": "हालको पासवर्ड",
  "Couldn't update your password.": "पासवर्ड अद्यावधिक गर्न सकिएन।",
  "Password updated.": "पासवर्ड अद्यावधिक भयो।",
  "Updating...": "अद्यावधिक हुँदैछ...",
  "Update password": "पासवर्ड अद्यावधिक गर्नुहोस्",
  "Forgot your password?": "पासवर्ड बिर्सनुभयो?",
  "Your email address cannot be changed here.":
    "यहाँबाट इमेल ठेगाना परिवर्तन गर्न सकिँदैन।",
  "Please choose an image file.": "कृपया फोटो फाइल छान्नुहोस्।",
  "Image must be under 5MB.": "फोटो 5MB भन्दा कम हुनुपर्छ।",
  "Your profile": "तपाईंको प्रोफाइल",

  "About Rentora": "Rentora को बारेमा",
  "Finding a rental should start with knowing where it is.":
    "भाडाको घर खोज्दा सबैभन्दा पहिले त्यो कहाँ छ भन्ने थाहा हुनुपर्छ।",
  "Rentora is built around the Kathmandu Valley rental market, bringing property discovery, location and direct owner contact into one focused experience.":
    "Rentora काठमाडौं उपत्यकाको भाडा बजारलाई ध्यानमा राखेर बनाइएको हो, जहाँ सम्पत्ति खोज, स्थान र घरधनीसँग प्रत्यक्ष सम्पर्क एउटै अनुभवमा जोडिएको छ।",
  "Why Rentora": "किन Rentora",
  "A clearer way to search.": "खोज्ने अझ स्पष्ट तरिका।",
  "Rentora is a rental search platform built around the Kathmandu valley housing market. Instead of scrolling endless listings with no sense of where they actually are, Rentora puts the map first — so you can see price, location, and commute distance together before you ever click into a listing.":
    "Rentora काठमाडौं उपत्यकाको आवास बजारका लागि बनाइएको भाडा खोज प्लेटफर्म हो। स्थान थाहा नहुने अनगिन्ती लिस्टिङ स्क्रोल गर्नुको सट्टा Rentora ले नक्सालाई प्राथमिकता दिन्छ — जसले लिस्टिङ खोल्नुअघि नै मूल्य, स्थान र आवतजावत दूरी सँगै देखाउँछ।",
  "We're just getting started, and we're building this with renters and property owners in the valley in mind — from students looking for a shared room near Koteshwor to families searching for a flat in Boudha.":
    "हामी भर्खर सुरु गर्दैछौं, र उपत्यकाका भाडावाला तथा घरधनीलाई ध्यानमा राखेर यो बनाइरहेका छौं — कोटेश्वर नजिक साझा कोठा खोज्ने विद्यार्थीदेखि बौद्धमा फ्ल्याट खोज्ने परिवारसम्म।",
  "Built around the essentials": "आवश्यक कुराहरूमा केन्द्रित",
  "See the place.": "ठाउँ हेर्नुहोस्।",
  "Understand the area.": "क्षेत्र बुझ्नुहोस्।",
  "Contact the owner.": "घरधनीलाई सम्पर्क गर्नुहोस्।",
  "Fewer unnecessary steps between discovering a property and deciding whether it's right for you.":
    "सम्पत्ति फेला पार्ने र आफूलाई उपयुक्त छ कि छैन निर्णय गर्ने बीच कम अनावश्यक चरणहरू।",
  "Every listing shows up as a pin, so you see price, location, and distance together before clicking in.":
    "हरेक लिस्टिङ नक्सामा पिनका रूपमा देखिन्छ, त्यसैले खोल्नुअघि नै मूल्य, स्थान र दूरी सँगै देख्न सक्नुहुन्छ।",
  "Direct contact": "प्रत्यक्ष सम्पर्क",
  "Reach out to owners straight from a listing — no middleman, no broker in between.":
    "लिस्टिङबाटै घरधनीलाई सम्पर्क गर्नुहोस् — बीचमा बिचौलिया वा दलाल हुँदैन।",
  "Built for the valley": "उपत्यकाका लागि बनाइएको",
  "Designed around how people actually search for housing in Kathmandu — by neighborhood, not zip code.":
    "काठमाडौंमा मानिसहरूले वास्तवमा घर खोज्ने तरिका — क्षेत्रअनुसार — लाई ध्यानमा राखेर डिजाइन गरिएको।",

  "Quick answers when you need them.": "चाहिएको बेला छिटो उत्तर।",
  "Find help with searching for properties, saving listings, contacting owners and managing your Rentora account.":
    "सम्पत्ति खोज, लिस्टिङ सुरक्षित गर्ने, घरधनीलाई सम्पर्क गर्ने र Rentora खाता व्यवस्थापनबारे सहायता पाउनुहोस्।",
  "Frequently asked": "बारम्बार सोधिने",
  "Common questions": "सामान्य प्रश्नहरू",
  "Click a question to view its answer.":
    "उत्तर हेर्न प्रश्नमा क्लिक गर्नुहोस्।",
  "Need more help?": "थप सहायता चाहिन्छ?",
  "Check the answers above first.": "पहिले माथिका उत्तरहरू हेर्नुहोस्।",
  "We're keeping Rentora simple, so most common account and property questions should be covered here.":
    "Rentora सरल राखिएको छ, त्यसैले अधिकांश सामान्य खाता र सम्पत्ति प्रश्नहरूको उत्तर यहाँ पाउनुहुनेछ।",
  "Rentora Help": "Rentora सहायता",
  "How do I contact a property owner?": "घरधनीलाई कसरी सम्पर्क गर्ने?",
  "Open any listing and use the contact details or message option on the listing page.":
    "कुनै पनि लिस्टिङ खोल्नुहोस् र लिस्टिङ पृष्ठमा रहेको सम्पर्क विवरण वा सन्देश विकल्प प्रयोग गर्नुहोस्।",
  "How do I list my own property?": "आफ्नो सम्पत्ति कसरी सूचीबद्ध गर्ने?",
  "Log in as a property owner and select \"List your property\" from the footer or navigation. If you don't have an account yet, you'll be asked to sign up first.":
    "घरधनीको रूपमा लगइन गरी फुटर वा नेभिगेसनबाट ‘आफ्नो सम्पत्ति सूचीबद्ध गर्नुहोस्’ छान्नुहोस्। खाता छैन भने पहिले खाता बनाउन भनिनेछ।",
  "Can I save listings to look at later?":
    "पछि हेर्न लिस्टिङ सुरक्षित गर्न सक्छु?",
  "Yes — use the save option on any listing card. You can view your saved listings from your dashboard.":
    "हो — कुनै पनि लिस्टिङ कार्डमा सुरक्षित गर्ने विकल्प प्रयोग गर्नुहोस्। ड्यासबोर्डबाट सुरक्षित लिस्टिङहरू हेर्न सक्नुहुन्छ।",
  "Is Rentora free to use?": "Rentora प्रयोग गर्न निःशुल्क हो?",
  "Yes, browsing and contacting owners is free for renters. There's no fee to list a property either.":
    "हो, भाडावालाका लागि खोज्न र घरधनीलाई सम्पर्क गर्न निःशुल्क छ। सम्पत्ति सूचीबद्ध गर्न पनि शुल्क छैन।",
  "Finding rentals": "भाडाका घर खोज्दै",
  "Search, map browsing and property filters.":
    "खोज, नक्सा ब्राउजिङ र सम्पत्ति फिल्टरहरू।",
  "Keep properties you want to revisit later.":
    "पछि फेरि हेर्न चाहेका सम्पत्तिहरू सुरक्षित राख्नुहोस्।",
  "Create and manage your rental properties.":
    "आफ्ना भाडा सम्पत्तिहरू बनाउनुहोस् र व्यवस्थापन गर्नुहोस्।",

  "How Rentora works": "Rentora कसरी काम गर्छ",
  "From search to visit in three steps.": "खोजदेखि अवलोकनसम्म तीन चरणमा।",
  "Discover the right area, save the places worth considering and contact the property owner directly.":
    "उपयुक्त क्षेत्र खोज्नुहोस्, विचार गर्न लायक ठाउँ सुरक्षित गर्नुहोस् र घरधनीलाई प्रत्यक्ष सम्पर्क गर्नुहोस्।",
  "The idea": "मुख्य विचार",
  "Spend less time figuring out where a property is and more time deciding whether it actually works for you.":
    "सम्पत्ति कहाँ छ भनेर बुझ्न कम समय र त्यो वास्तवमै तपाईंका लागि उपयुक्त छ कि छैन निर्णय गर्न बढी समय खर्च गर्नुहोस्।",
  "Search the map, not just a list": "केवल सूची होइन, नक्सामा खोज्नुहोस्",
  "Filter by price, location, and property type. Every listing shows up as a pin, so you see exactly where it sits in the valley before you click in.":
    "मूल्य, स्थान र सम्पत्ति प्रकारअनुसार फिल्टर गर्नुहोस्। हरेक लिस्टिङ पिनका रूपमा देखिन्छ, त्यसैले खोल्नुअघि नै उपत्यकामा ठ्याक्कै कहाँ छ देख्न सक्नुहुन्छ।",
  "Compare and save": "तुलना गर्नुहोस् र सुरक्षित राख्नुहोस्",
  "Open a listing to see photos, price, and details. Save the ones you like so you can come back and compare later.":
    "फोटो, मूल्य र विवरण हेर्न लिस्टिङ खोल्नुहोस्। मनपरेका लिस्टिङ सुरक्षित गर्नुहोस् ताकि पछि तुलना गर्न सक्नुहोस्।",
  "Contact the owner directly": "घरधनीलाई प्रत्यक्ष सम्पर्क गर्नुहोस्",
  "Reach out to the property owner straight from the listing page — no middleman, no waiting on a broker to call back.":
    "लिस्टिङ पृष्ठबाटै घरधनीलाई सम्पर्क गर्नुहोस् — न बिचौलिया, न दलालको फोनको प्रतीक्षा।",

  "Privacy at Rentora": "Rentora मा गोपनीयता",
  "Your information should have a clear purpose.":
    "तपाईंको जानकारीको स्पष्ट उद्देश्य हुनुपर्छ।",
  "This page explains what Rentora collects, why we use it, and how that information supports your experience on the platform.":
    "यस पृष्ठले Rentora ले के जानकारी संकलन गर्छ, किन प्रयोग गर्छ र त्यसले प्लेटफर्ममा तपाईंको अनुभवलाई कसरी सहयोग गर्छ भन्ने बताउँछ।",
  "Privacy summary": "गोपनीयता सारांश",
  "Last updated: August 2026": "अन्तिम अद्यावधिक: अगस्ट २०२६",
  "Information we collect": "हामीले संकलन गर्ने जानकारी",
  "When you create an account, we collect your name, email address, and role (renter or owner). If you list a property, we also store the listing details and photos you provide.":
    "खाता बनाउँदा हामी तपाईंको नाम, इमेल ठेगाना र भूमिका (भाडावाला वा घरधनी) संकलन गर्छौं। सम्पत्ति सूचीबद्ध गरेमा तपाईंले दिएको लिस्टिङ विवरण र फोटो पनि भण्डारण गर्छौं।",
  "How we use your information": "तपाईंको जानकारी कसरी प्रयोग गर्छौं",
  "We use your information to run your account, show your listings or saved properties, and let renters and owners contact each other.":
    "तपाईंको खाता सञ्चालन गर्न, लिस्टिङ वा सुरक्षित सम्पत्ति देखाउन र भाडावाला तथा घरधनीबीच सम्पर्क गराउन हामी तपाईंको जानकारी प्रयोग गर्छौं।",
  "Account and listing data": "खाता र लिस्टिङ डेटा",
  "Information connected to your account is used to provide Rentora features such as authentication, saved listings, property management and interaction between renters and owners.":
    "तपाईंको खातासँग सम्बन्धित जानकारी प्रमाणीकरण, सुरक्षित लिस्टिङ, सम्पत्ति व्यवस्थापन र भाडावाला-घरधनीबीच अन्तरक्रिया जस्ता Rentora सुविधाहरू प्रदान गर्न प्रयोग गरिन्छ।",
  "We don't sell your personal data.": "हामी तपाईंको व्यक्तिगत डेटा बेच्दैनौं।",
  "Your data is used to provide Rentora features.":
    "तपाईंको डेटा Rentora सुविधाहरू प्रदान गर्न प्रयोग हुन्छ।",
  "Listing information is shown only where the platform requires it.":
    "लिस्टिङ जानकारी प्लेटफर्मलाई आवश्यक ठाउँमा मात्र देखाइन्छ।",
  "Your data at Rentora": "Rentora मा तपाईंको डेटा",
  "What happens to the information you provide?":
    "तपाईंले दिएको जानकारीलाई के हुन्छ?",
  "The basic flow is intentionally simple.":
    "आधारभूत प्रक्रिया जानाजानी सरल राखिएको छ।",
  "You provide it": "तपाईं जानकारी दिनुहुन्छ",
  "Account information, property details and photos.":
    "खाता जानकारी, सम्पत्ति विवरण र फोटोहरू।",
  "Rentora uses it": "Rentora ले प्रयोग गर्छ",
  "To provide accounts, listings, saves and platform features.":
    "खाता, लिस्टिङ, सुरक्षित सुविधा र प्लेटफर्मका अन्य सुविधा प्रदान गर्न।",
  "You get the experience": "तपाईंले अनुभव पाउनुहुन्छ",
  "Relevant listings, saved properties and account management.":
    "सान्दर्भिक लिस्टिङ, सुरक्षित सम्पत्ति र खाता व्यवस्थापन।",
  "Questions about privacy?": "गोपनीयताबारे प्रश्न छन्?",
  "Visit the Help center.": "सहायता केन्द्र हेर्नुहोस्।",
  "Questions about this policy can be sent through the Help center.":
    "यस नीतिबारे प्रश्न सहायता केन्द्रमार्फत पठाउन सकिन्छ।",

  Legal: "कानुनी",
  "The basic rules for using Rentora as a renter or property owner.":
    "भाडावाला वा घरधनीको रूपमा Rentora प्रयोग गर्ने आधारभूत नियमहरू।",
  "On this page": "यस पृष्ठमा",
  "Using Rentora": "Rentora प्रयोग गर्दा",
  "Rentora connects renters and property owners in the Kathmandu valley. By using the site, you agree to provide accurate information in your account and listings.":
    "Rentora ले काठमाडौं उपत्यकाका भाडावाला र घरधनीलाई जोड्छ। साइट प्रयोग गरेर, तपाईं आफ्नो खाता र लिस्टिङमा सही जानकारी दिन सहमत हुनुहुन्छ।",
  Listings: "लिस्टिङहरू",
  "Property owners are responsible for the accuracy of their listings, including price, photos, and availability. Rentora does not verify listings and is not a party to any rental agreement made between users.":
    "लिस्टिङको मूल्य, फोटो र उपलब्धतासहितको शुद्धताका लागि घरधनी जिम्मेवार हुन्छन्। Rentora ले लिस्टिङ प्रमाणित गर्दैन र प्रयोगकर्ताबीच हुने कुनै भाडा सम्झौताको पक्ष हुँदैन।",
  "Account responsibility": "खाता जिम्मेवारी",
  "You're responsible for keeping your login credentials secure and for any activity that happens under your account.":
    "आफ्नो लगइन विवरण सुरक्षित राख्न र खाताअन्तर्गत हुने गतिविधिका लागि तपाईं जिम्मेवार हुनुहुन्छ।",
  "Rental agreements": "भाडा सम्झौताहरू",
  "Any rental agreement, deposit, payment arrangement or other transaction is made directly between the renter and property owner. Rentora provides the platform for discovery and connection but is not a party to the agreement.":
    "कुनै पनि भाडा सम्झौता, धरौटी, भुक्तानी व्यवस्था वा अन्य कारोबार भाडावाला र घरधनीबीच प्रत्यक्ष हुन्छ। Rentora ले खोज र सम्पर्कका लागि प्लेटफर्म प्रदान गर्छ तर सम्झौताको पक्ष हुँदैन।",
};

const basePairs = flattenPairs(en, ne);
for (const [english, nepali] of Object.entries(legacyUiTranslations)) {
  basePairs.set(english, nepali);
}

const nepaliToEnglish = new Map(
  [...basePairs.entries()].map(([english, nepali]) => [nepali, english]),
);

const TRANSLATABLE_ATTRIBUTES = ["placeholder", "title", "aria-label", "alt"];

function normalize(value) {
  return value.replace(/\s+/g, " ").trim();
}

function translateValue(value, language) {
  if (!value || !/[A-Za-z\u0900-\u097F]/.test(value)) return value;

  const normalized = normalize(value);
  if (!normalized) return value;

  let translated;
  if (language === "ne") {
    translated = basePairs.get(normalized);

    if (!translated) {
      const listingsMatch = normalized.match(/^(\d+) listings? found here$/);
      if (listingsMatch) translated = `${listingsMatch[1]} लिस्टिङ यहाँ भेटियो`;
    }

    if (!translated) {
      const requestsMatch = normalized.match(/^Requests \((\d+)\)$/);
      if (requestsMatch) translated = `अनुरोधहरू (${requestsMatch[1]})`;
    }
  } else {
    translated = nepaliToEnglish.get(normalized);
  }

  if (!translated || translated === normalized) return value;

  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function translateElement(root, language) {
  if (!root) return;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  for (const node of textNodes) {
    const parent = node.parentElement;
    if (!parent || ["SCRIPT", "STYLE", "CODE", "PRE"].includes(parent.tagName))
      continue;
    const next = translateValue(node.nodeValue, language);
    if (next !== node.nodeValue) node.nodeValue = next;
  }

  if (root.nodeType === Node.ELEMENT_NODE) {
    const elements = [root, ...root.querySelectorAll("*")];
    for (const element of elements) {
      for (const attr of TRANSLATABLE_ATTRIBUTES) {
        if (!element.hasAttribute(attr)) continue;
        const current = element.getAttribute(attr);
        const next = translateValue(current, language);
        if (next !== current) element.setAttribute(attr, next);
      }
    }
  }
}

export default function AutoTranslate({ children }) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage?.startsWith("ne") ? "ne" : "en";

  useLayoutEffect(() => {
    document.documentElement.lang = language;
    const root = document.getElementById("root");
    if (!root) return undefined;

    let translating = false;

    const run = (target = root) => {
      if (translating) return;
      translating = true;
      try {
        translateElement(
          target.nodeType === Node.TEXT_NODE ? target.parentElement : target,
          language,
        );
      } finally {
        translating = false;
      }
    };

    run(root);

    const observer = new MutationObserver((mutations) => {
      if (translating) return;
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          run(mutation.target);
          continue;
        }
        for (const node of mutation.addedNodes) {
          if (
            node.nodeType === Node.ELEMENT_NODE ||
            node.nodeType === Node.TEXT_NODE
          ) {
            run(node);
          }
        }
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, [language]);

  return children;
}
