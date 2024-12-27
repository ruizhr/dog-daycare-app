document.addEventListener("DOMContentLoaded", () => {
    const dogOwnerForm = document.getElementById("dogOwnerForm");
    const serviceForm = document.getElementById("serviceForm");
    const membershipForm = document.getElementById("membershipForm");
    const paymentForm = document.getElementById("paymentForm");
    const dogSelect = document.getElementById("dogSelect");
    const membershipDogSelect = document.getElementById("membershipDogSelect");
    const paymentDogSelect = document.getElementById("paymentDogSelect");
    const profileDogSelect = document.createElement("select");
    const passInfo = document.getElementById("passInfo");
    const dogProfilesDiv = document.getElementById("dogProfiles");

    const dogProfiles = {};

    // Create dropdown for profile selection
    profileDogSelect.id = "profileDogSelect";
    profileDogSelect.innerHTML = `<option value="" disabled selected>Select a dog</option>`;
    dogProfilesDiv.before(profileDogSelect);

    const saveProfilesToDynamoDB = async () => {
        const promises = Object.keys(dogProfiles).map(async (dogId) => {
            const params = {
                TableName: 'DogProfiles',
                Item: {
                    dogId,
                    ...dogProfiles[dogId],
                },
            };
            return dynamoDB.put(params).promise();
        });
        await Promise.all(promises);
        console.log("Profiles saved to DynamoDB:", dogProfiles);
    };

    const loadProfilesFromDynamoDB = async () => {
        const params = {
            TableName: 'DogProfiles',
        };
        const data = await dynamoDB.scan(params).promise();
        data.Items.forEach(item => {
            dogProfiles[item.dogId] = item; // Load each profile into dogProfiles
        });
        renderProfileDropdown(); // Update dropdowns with loaded profiles
    };

    const renderProfileDropdown = () => {
        // Populate the dropdowns with dog profiles in alphabetical order by dog name
        const dogOptions = Object.keys(dogProfiles)
            .sort((a, b) => {
                // Extract dog names from dogId
                const dogNameA = a.split(" (")[0]; // Get the part before the parenthesis
                const dogNameB = b.split(" (")[0]; // Get the part before the parenthesis
                return dogNameA.localeCompare(dogNameB); // Compare dog names
            })
            .map(dogId => {
                return `<option value="${dogId}">${dogId}</option>`;
            })
            .join("");

        dogSelect.innerHTML = `<option value="" disabled selected>Select a dog</option>${dogOptions}`;
        membershipDogSelect.innerHTML = `<option value="" disabled selected>Select a dog</option>${dogOptions}`;
        paymentDogSelect.innerHTML = `<option value="" disabled selected>Select a dog</option>${dogOptions}`;
        profileDogSelect.innerHTML = `<option value="" disabled selected>Select a dog</option>${dogOptions}`;
    };

    // Call this function on DOMContentLoaded
    loadProfilesFromDynamoDB(); // Load profiles when the app starts

    const addDog = (event) => {
        event.preventDefault();
        const ownerName = document.getElementById("ownerFullName").value;
        const dogName = document.getElementById("dogName").value;
        const breed = document.getElementById("breed").value;
        const ownerAddress = document.getElementById("ownerAddress").value;
        const ownerPhonePrimary = document.getElementById("ownerPhonePrimary").value;
        const ownerPhoneWork = document.getElementById("ownerPhoneWork").value;
        const ownerEmail = document.getElementById("ownerEmail").value;
        const emergencyContactName = document.getElementById("emergencyContactName").value;
        const emergencyContactPhone = document.getElementById("emergencyContactPhone").value;
        const emergencyContactRelationship = document.getElementById("emergencyContactRelationship").value;
        const vetName = document.getElementById("vetName").value;
        const vetPhone = document.getElementById("vetPhone").value;
        const preferredEmergencyVet = document.getElementById("preferredEmergencyVet").value;
        const age = document.getElementById("age").value;
        const birthday = document.getElementById("birthday").value;
        const color = document.getElementById("color").value;
        const weight = document.getElementById("weight").value;
        const allergies = document.getElementById("allergies").value;
        const medications = document.getElementById("medications").value;
        const medicalConditions = document.getElementById("medicalConditions").value;

        // Capture vaccination dates for each type
        const vaccinationDateAntirrabica = document.getElementById("vaccinationDateAntirrabica").value; // New field
        const vaccinationDateGiardia = document.getElementById("vaccinationDateGiardia").value; // New field
        const vaccinationDateBordetella = document.getElementById("vaccinationDateBordetella").value; // New field
        const vaccinationDateDesparacitacion = document.getElementById("vaccinationDateDesparacitacion").value; // New field
        const vaccinationDateAmpolleta = document.getElementById("vaccinationDateAmpolleta").value; // New field

        const dietaryRequirements = document.getElementById("dietaryRequirements").value;
        const behaviorTraits = document.getElementById("behaviorTraits").value;
        const servicesNeeded = document.getElementById("servicesNeeded").value;
        const specialInstructions = document.getElementById("specialInstructions").value;
        const additionalNotes = document.getElementById("additionalNotes").value;
        const petHistory = document.getElementById("petHistory").value;
        const permissions = document.getElementById("permissions").value;

        // Capture compatibility fields
        const personality = document.getElementById("personality").value;
        const behavior = document.getElementById("behavior").value;
        const energyLevel = document.getElementById("energyLevel").value;
        const compatibility = document.getElementById("compatibility").value;
        const activityPreferences = document.getElementById("activityPreferences").value;
        const socializationLevel = document.getElementById("socializationLevel").value;
        const trainingLevel = document.getElementById("trainingLevel").value;

        const dogId = `${dogName} (${ownerName})`;

        if (!dogProfiles[dogId]) {
            dogProfiles[dogId] = {
                ownerName,
                ownerAddress,
                ownerPhonePrimary,
                ownerPhoneWork,
                ownerEmail,
                emergencyContactName,
                emergencyContactPhone,
                emergencyContactRelationship,
                vetName,
                vetPhone,
                preferredEmergencyVet,
                dogName,
                breed,
                age,
                birthday,
                color,
                weight,
                allergies,
                medications,
                medicalConditions,
                vaccinationRecords: {
                    antirrabica: vaccinationDateAntirrabica,
                    giardia: vaccinationDateGiardia,
                    bordetella: vaccinationDateBordetella,
                    desparacitacion: vaccinationDateDesparacitacion,
                    ampolleta: vaccinationDateAmpolleta,
                },
                dietaryRequirements,
                behaviorTraits,
                servicesNeeded,
                specialInstructions,
                additionalNotes,
                petHistory,
                permissions,
                services: [],
                payments: [],
                memberships: [],
                amountOwed: 0,
                personality,
                behavior,
                energyLevel,
                compatibility,
                activityPreferences,
                socializationLevel,
                trainingLevel,
            };

            addOptionToDropdowns(dogId);
            renderProfileDropdown();
            saveProfilesToDynamoDB(); // Save to localStorage after adding a dog
        }

        dogOwnerForm.reset();
    };

    const addOptionToDropdowns = (dogId) => {
        const option = document.createElement("option");
        option.value = dogId;
        option.textContent = dogId;

        // Append the option to each dropdown and then sort the dropdowns
        dogSelect.appendChild(option.cloneNode(true));
        membershipDogSelect.appendChild(option.cloneNode(true));
        paymentDogSelect.appendChild(option.cloneNode(true));
        profileDogSelect.appendChild(option);

        // Re-render the dropdowns to ensure they are in alphabetical order
        renderProfileDropdown();
    };

    const serviceTypeSelect = document.getElementById("serviceType");
    const hotelServiceFields = document.getElementById("hotelServiceFields");
    const serviceDateInput = document.getElementById("serviceDate");
    const checkInDateInput = document.createElement("input");
    const checkOutDateInput = document.createElement("input");
    const checkInTimeInput = document.createElement("input");
    const checkOutTimeInput = document.createElement("input");
    const hourlyRateInput = document.createElement("input");
    hourlyRateInput.type = "number";
    hourlyRateInput.id = "hourlyRate";
    hourlyRateInput.placeholder = "Hourly Rate";
    hourlyRateInput.style.display = "none"; // Initially hidden

    const extraHoursInput = document.createElement("input");
    extraHoursInput.type = "number";
    extraHoursInput.id = "extraHours";
    extraHoursInput.placeholder = "Extra Hours";
    extraHoursInput.readOnly = true; // Read-only as it will be calculated
    extraHoursInput.style.display = "none"; // Initially hidden

    // Set attributes for check-in and check-out inputs
    checkInDateInput.type = "date";
    checkInDateInput.id = "checkInDate";
    checkInDateInput.placeholder = "Check-in Date";

    checkOutDateInput.type = "date";
    checkOutDateInput.id = "checkOutDate";
    checkOutDateInput.placeholder = "Check-out Date";

    checkInTimeInput.type = "time";
    checkInTimeInput.id = "checkInTime";
    checkInTimeInput.placeholder = "Check-in Time";

    checkOutTimeInput.type = "time";
    checkOutTimeInput.id = "checkOutTime";
    checkOutTimeInput.placeholder = "Check-out Time";

    // Show/hide fields based on service type
    serviceTypeSelect.addEventListener("change", () => {
        hotelServiceFields.innerHTML = ""; // Clear previous fields
        serviceDateInput.style.display = "block"; // Show the service date input
        hourlyRateInput.style.display = "none"; // Hide hourly rate
        extraHoursInput.style.display = "none"; // Hide extra hours

        if (serviceTypeSelect.value === "hotel") {
            // Add check-in and check-out date fields for hotel
            hotelServiceFields.appendChild(checkInDateInput);
            hotelServiceFields.appendChild(checkOutDateInput);
            hotelServiceFields.style.display = "block"; // Show hotel service fields
        } else if (serviceTypeSelect.value === "daycare") {
            // Add check-in and check-out time fields for daycare
            hotelServiceFields.appendChild(checkInTimeInput);
            hotelServiceFields.appendChild(checkOutTimeInput);
            hotelServiceFields.appendChild(hourlyRateInput); // Show hourly rate input
            hotelServiceFields.appendChild(extraHoursInput); // Show extra hours input
            hourlyRateInput.style.display = "block"; // Show hourly rate
            extraHoursInput.style.display = "block"; // Show extra hours

            // Calculate extra hours based on check-in and check-out times
            checkInTimeInput.addEventListener("change", calculateExtraHours);
            checkOutTimeInput.addEventListener("change", calculateExtraHours);
        } else {
            hotelServiceFields.style.display = "none"; // Hide hotel service fields for other services
        }
    });

    // Function to calculate extra hours
    const calculateExtraHours = () => {
        const checkInTime = new Date(`1970-01-01T${checkInTimeInput.value}:00`);
        const checkOutTime = new Date(`1970-01-01T${checkOutTimeInput.value}:00`);
        const totalHours = (checkOutTime - checkInTime) / (1000 * 3600); // Convert milliseconds to hours

        if (totalHours > 6) {
            const extraHours = totalHours - 6;
            extraHoursInput.value = extraHours.toFixed(2); // Set extra hours
        } else {
            extraHoursInput.value = 0; // No extra hours
        }
    };

    const addService = (event) => {
        event.preventDefault();
        const dogId = dogSelect.value;
        const serviceType = serviceTypeSelect.value;
        const price = parseFloat(document.getElementById("price").value);
        const serviceDate = serviceDateInput.value; // Get the service date

        // Ensure the service date is provided
        if (!serviceDate) {
            alert("Please provide a Date of Service.");
            return; // Prevent submission if the date is missing
        }

        let checkInDate, checkOutDate, checkInTime, checkOutTime;
        let profile; // Declare profile variable
        let extraHours = 0; // Initialize extraHours variable

        // Retrieve the profile for the selected dog
        profile = dogProfiles[dogId]; // Retrieve the profile for the selected dog

        // Check if the profile exists
        if (!profile) {
            alert("Dog profile not found.");
            return; // Prevent submission if the profile is not found
        }

        // Check for membership before adding service
        const membership = profile.memberships.find(
            (m) =>
                m.serviceType === serviceType &&
                new Date() <= new Date(m.expiryDate) &&
                m.passesLeft > 0
        );

        // Allow adding service without valid passes
        if (membership) {
            if (serviceType === "hotel") {
                checkInDate = checkInDateInput.value; // Get check-in date
                checkOutDate = checkOutDateInput.value; // Get check-out date

                // Ensure check-in and check-out dates are provided
                if (!checkInDate || !checkOutDate) {
                    alert("Please provide Check-in and Check-out dates.");
                    return;
                }

                // Calculate the number of nights
                const checkIn = new Date(checkInDate);
                const checkOut = new Date(checkOutDate);
                const timeDiff = checkOut - checkIn;
                const nights = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days

                if (nights <= 0) {
                    alert("Check-out date must be after check-in date.");
                    return;
                }

                // Decrease passes based on the number of nights
                if (membership.passesLeft >= nights) {
                    membership.passesLeft -= nights; // Decrement passes by the number of nights
                } else {
                    alert("Not enough passes available for the number of nights.");
                    return; // Prevent submission if not enough passes
                }

                // If passes left reach zero, notify the user
                if (membership.passesLeft === 0) {
                    alert("You have used all your passes for this service.");
                }
            } else {
                // For other service types, just decrement one pass
                membership.passesLeft--; // Decrement the number of passes left
                // If passes left reach zero, notify the user
                if (membership.passesLeft === 0) {
                    alert("You have used all your passes for this service.");
                }
            }
        }

        if (serviceType === "hotel") {
            // Add hotel service
            profile.services.push({
                serviceType: "hotel",
                price,
                serviceDate,
                checkInDate, // Use checkInDate
                checkOutDate, // Use checkOutDate
            });

            // Update amount owed
            profile.amountOwed += price;
        } else if (serviceType === "daycare") {
            checkInTime = checkInTimeInput.value;
            checkOutTime = checkOutTimeInput.value;
            // Ensure check-in and check-out times are provided
            if (!checkInTime || !checkOutTime) {
                alert("Please provide Check-in and Check-out times.");
                return;
            }

            // Calculate extra hours and price for daycare extra hours
            const hourlyRate = parseFloat(hourlyRateInput.value);
            extraHours = parseFloat(extraHoursInput.value); // Get extra hours from the input
            const extraHoursPrice = hourlyRate * extraHours;

            // Add daycare service
            profile.services.push({
                serviceType: "daycare",
                price,
                serviceDate,
                checkInDate: checkInTime,
                checkOutDate: checkOutTime,
                checkInTime,
                checkOutTime,
                extraHours: 0 // Set extraHours to 0 for daycare service
            });
            
            // Update amount owed
            profile.amountOwed += price;

            // Add daycare extra hours service if applicable
            if (extraHours > 0) {
                profile.services.push({
                    serviceType: "daycare extra hours",
                    price: extraHoursPrice,
                    serviceDate,
                    checkInDate: checkInTime,
                    checkOutDate: checkOutTime,
                    checkInTime,
                    checkOutTime,
                    extraHours // Include extraHours in the service object
                });
                // Update amount owed for extra hours
                profile.amountOwed += extraHoursPrice;
            }
        } else if (serviceType === "training") {
            // Add training service
            profile.services.push({
                serviceType: "training",
                price,
                serviceDate,
                // Additional fields can be added as needed
            });

            // Update amount owed
            profile.amountOwed += price;
        } else if (serviceType === "grooming") {
            // Add grooming service
            profile.services.push({
                serviceType: "grooming",
                price,
                serviceDate,
                // Additional fields can be added as needed
            });

            // Update amount owed
            profile.amountOwed += price;
        }

        // Sort services by service date
        profile.services.sort((a, b) => new Date(b.serviceDate) - new Date(a.serviceDate));

        // Debugging: Log the profile to check if services are added correctly
        console.log("Profile before saving:", profile);

        renderProfiles();
        saveProfilesToDynamoDB(); // Save to localStorage after adding a service

        serviceForm.reset();
        updatePassInfo(); // Ensure pass info is updated after adding service
    };

    const updatePassInfo = () => {
        const dogId = dogSelect.value;
        const serviceType = document.getElementById("serviceType").value;

        if (dogId && dogProfiles[dogId]) {
            const profile = dogProfiles[dogId];
            const membership = profile.memberships.find(
                (m) =>
                    m.serviceType === serviceType &&
                    new Date() <= new Date(m.expiryDate) &&
                    m.passesLeft > 0
            );

            if (membership) {
                passInfo.textContent = `${membership.passesLeft} passes left (expires on ${membership.expiryDate})`;
            } else {
                passInfo.textContent = "No valid passes for this service.";
            }
        } else {
            passInfo.textContent = "";
        }
    };

    const addMembershipPasses = (event) => {
        event.preventDefault();
        const dogId = membershipDogSelect.value;
        const serviceType = document.getElementById("membershipServiceType").value;
        const numberOfPasses = parseInt(document.getElementById("numberOfPasses").value);
        const price = parseFloat(document.getElementById("membershipPrice").value);
        const membershipDate = document.getElementById("membershipDate").value;
        const membershipExpiryDate = document.getElementById("membershipExpiryDate").value; // Get the new expiration date

        if (dogProfiles[dogId]) {
            dogProfiles[dogId].memberships.push({
                serviceType,
                numberOfPasses,
                passesLeft: numberOfPasses,
                price,
                date: membershipDate,
                expiryDate: membershipExpiryDate, // Use the user-defined expiration date
            });

            dogProfiles[dogId].amountOwed += price; // Update amount owed
            dogProfiles[dogId].memberships.sort((a, b) => new Date(b.date) - new Date(a.date));
            renderProfiles();
            saveProfilesToDynamoDB(); // Save to localStorage after adding membership
        }

        membershipForm.reset();
        updatePassInfo(); // Update pass info after adding membership
    };

    const recordPayment = (event) => {
        event.preventDefault();
        const dogId = paymentDogSelect.value;
        const paymentAmount = parseFloat(document.getElementById("paymentAmount").value);
        const paymentDate = document.getElementById("paymentDate").value;

        if (dogProfiles[dogId]) {
            const profile = dogProfiles[dogId];
            profile.payments.push({ paymentAmount, paymentDate });
            profile.payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
            profile.amountOwed -= paymentAmount; // Update amount owed
            renderProfiles();
            saveProfilesToDynamoDB(); // Save to localStorage after recording payment
        }

        paymentForm.reset();
    };

    const renderProfiles = () => {
        dogProfilesDiv.innerHTML = "";
        const dogId = profileDogSelect.value;

        if (dogId && dogProfiles[dogId]) {
            const profile = dogProfiles[dogId];
            const profileDiv = document.createElement("div");

            profileDiv.innerHTML = `
                <h3>${profile.dogName} (${profile.breed})</h3>
                <input type="file" id="dogPhotoInput" accept="image/*" />
                <img id="dogPhoto" src="${profile.photo || ''}" alt="Dog Photo" style="display: ${profile.photo ? 'block' : 'none'}; max-width: 200px;"/>
                <p>Owner: ${profile.ownerName}</p>
                <p class="amount-owed">Amount Owed: $${profile.amountOwed.toFixed(2)}</p>
                ${createExpandableSection(profile.services, 'Services')}
                ${createExpandableSection(profile.memberships, 'Memberships')}
                ${createExpandableSection(profile.payments, 'Payments')}
                <button id="editProfileButton">Edit Profile</button>
                <button id="deleteProfileButton">Delete Profile</button>
                <div id="editProfileForm" style="display: none;" class="form-container">
                    <h4>Edit Profile</h4>
                    <div class="form-group">
                        <label for="editDogName">Dog Name:</label>
                        <input type="text" id="editDogName" value="${profile.dogName}" required>
                    </div>
                    <div class="form-group">
                        <label for="editBreed">Breed:</label>
                        <input type="text" id="editBreed" value="${profile.breed}" required>
                    </div>
                    <div class="form-group">
                        <label for="editOwnerName">Owner Name:</label>
                        <input type="text" id="editOwnerName" value="${profile.ownerName}" required>
                    </div>
                    <div class="form-group">
                        <label for="editOwnerAddress">Owner Address:</label>
                        <input type="text" id="editOwnerAddress" value="${profile.ownerAddress}" required>
                    </div>
                    <div class="form-group">
                        <label for="editOwnerPhonePrimary">Owner Phone (Primary):</label>
                        <input type="tel" id="editOwnerPhonePrimary" value="${profile.ownerPhonePrimary}" required>
                    </div>
                    <div class="form-group">
                        <label for="editOwnerPhoneWork">Owner Phone (Work):</label>
                        <input type="tel" id="editOwnerPhoneWork" value="${profile.ownerPhoneWork}">
                    </div>
                    <div class="form-group">
                        <label for="editOwnerEmail">Owner Email:</label>
                        <input type="email" id="editOwnerEmail" value="${profile.ownerEmail}" required>
                    </div>
                    <div class="form-group">
                        <label for="editEmergencyContactName">Emergency Contact Name:</label>
                        <input type="text" id="editEmergencyContactName" value="${profile.emergencyContactName}" required>
                    </div>
                    <div class="form-group">
                        <label for="editEmergencyContactPhone">Emergency Contact Phone:</label>
                        <input type="tel" id="editEmergencyContactPhone" value="${profile.emergencyContactPhone}" required>
                    </div>
                    <div class="form-group">
                        <label for="editEmergencyContactRelationship">Emergency Contact Relationship:</label>
                        <input type="text" id="editEmergencyContactRelationship" value="${profile.emergencyContactRelationship}" required>
                    </div>
                    <div class="form-group">
                        <label for="editVetName">Vet Name:</label>
                        <input type="text" id="editVetName" value="${profile.vetName}" required>
                    </div>
                    <div class="form-group">
                        <label for="editVetPhone">Vet Phone:</label>
                        <input type="tel" id="editVetPhone" value="${profile.vetPhone}" required>
                    </div>
                    <div class="form-group">
                        <label for="editPreferredEmergencyVet">Preferred Emergency Vet:</label>
                        <input type="text" id="editPreferredEmergencyVet" value="${profile.preferredEmergencyVet}">
                    </div>
                    <div class="form-group">
                        <label for="editAge">Age:</label>
                        <input type="number" id="editAge" value="${profile.age}" required>
                    </div>
                    <div class="form-group">
                        <label for="editBirthday">Birthday:</label>
                        <input type="date" id="editBirthday" value="${new Date(profile.birthday).toISOString().split('T')[0]}" required>
                    </div>
                    <div class="form-group">
                        <label for="editColor">Color/Markings:</label>
                        <input type="text" id="editColor" value="${profile.color}">
                    </div>
                    <div class="form-group">
                        <label for="editWeight">Weight:</label>
                        <input type="number" id="editWeight" value="${profile.weight}" required>
                    </div>
                    <div class="form-group">
                        <label for="editAllergies">Allergies:</label>
                        <textarea id="editAllergies">${profile.allergies}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editMedications">Medications:</label>
                        <textarea id="editMedications">${profile.medications}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editMedicalConditions">Known Medical Conditions:</label>
                        <textarea id="editMedicalConditions">${profile.medicalConditions}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editVaccinationAntirrabica">Antirrabica Vaccination Date:</label>
                        <input type="date" id="editVaccinationAntirrabica" value="${profile.vaccinationRecords.antirrabica}">
                    </div>
                    <div class="form-group">
                        <label for="editVaccinationGiardia">Giardia Vaccination Date:</label>
                        <input type="date" id="editVaccinationGiardia" value="${profile.vaccinationRecords.giardia}">
                    </div>
                    <div class="form-group">
                        <label for="editVaccinationBordetella">Bordetella Vaccination Date:</label>
                        <input type="date" id="editVaccinationBordetella" value="${profile.vaccinationRecords.bordetella}">
                    </div>
                    <div class="form-group">
                        <label for="editVaccinationDesparacitacion">Desparacitacion Vaccination Date:</label>
                        <input type="date" id="editVaccinationDesparacitacion" value="${profile.vaccinationRecords.desparacitacion}">
                    </div>
                    <div class="form-group">
                        <label for="editVaccinationAmpolleta">Ampolleta para pulgas Vaccination Date:</label>
                        <input type="date" id="editVaccinationAmpolleta" value="${profile.vaccinationRecords.ampolleta}">
                    </div>
                    <div class="form-group">
                        <label for="editDietaryRequirements">Dietary Requirements:</label>
                        <textarea id="editDietaryRequirements">${profile.dietaryRequirements}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editBehaviorTraits">Behavior Traits:</label>
                        <textarea id="editBehaviorTraits">${profile.behaviorTraits}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editServicesNeeded">Services Needed:</label>
                        <textarea id="editServicesNeeded">${profile.servicesNeeded}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editSpecialInstructions">Special Instructions:</label>
                        <textarea id="editSpecialInstructions">${profile.specialInstructions}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editAdditionalNotes">Additional Notes:</label>
                        <textarea id="editAdditionalNotes">${profile.additionalNotes}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editPetHistory">Pet History:</label>
                        <textarea id="editPetHistory">${profile.petHistory}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editPermissions">Permissions:</label>
                        <textarea id="editPermissions">${profile.permissions}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editPersonality">Personality:</label>
                        <select id="editPersonality" required>
                            <option value="${profile.personality}" selected>${profile.personality}</option>
                            <option value="1">Calm</option>
                            <option value="2">Playful</option>
                            <option value="3">Curious</option>
                            <option value="4">Shy</option>
                            <option value="5">Confident</option>
                            <option value="6">Reserved</option>
                            <option value="7">Aggressive</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editBehavior">Behavior:</label>
                        <select id="editBehavior" required>
                            <option value="${profile.behavior}" selected>${profile.behavior}</option>
                            <option value="1">Friendly</option>
                            <option value="2">Neutral</option>
                            <option value="3">Shy</option>
                            <option value="4">Playful</option>
                            <option value="5">Submissive</option>
                            <option value="6">Dominant</option>
                            <option value="7">Aggressive</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editEnergyLevel">Energy Level:</label>
                        <select id="editEnergyLevel" required>
                            <option value="${profile.energyLevel}" selected>${profile.energyLevel}</option>
                            <option value="1">Low</option>
                            <option value="2">Moderate</option>
                            <option value="3">High</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editCompatibility">Compatibility:</label>
                        <select id="editCompatibility" required>
                            <option value="${profile.compatibility}" selected>${profile.compatibility}</option>
                            <option value="1">Similar size</option>
                            <option value="2">Calm personalities</option>
                            <option value="3">Playful personalities</option>
                            <option value="4">High-energy dogs</option>
                            <option value="5">Dogs of the same breed</option>
                            <option value="6">Age-appropriate matches</option>
                            <option value="7">Dogs with prior training</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editActivityPreferences">Activity Preferences:</label>
                        <select id="editActivityPreferences" required>
                            <option value="${profile.activityPreferences}" selected>${profile.activityPreferences}</option>
                            <option value="1">Relaxing</option>
                            <option value="2">Walking</option>
                            <option value="3">Playing fetch</option>
                            <option value="4">Swimming</option>
                            <option value="5">Running</option>
                            <option value="6">Exploring</option>
                            <option value="7">Training sessions</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editSocializationLevel">Socialization Level:</label>
                        <select id="editSocializationLevel" required>
                            <option value="${profile.socializationLevel}" selected>${profile.socializationLevel}</option>
                            <option value="1">Highly social</option>
                            <option value="2">Moderately social</option>
                            <option value="3">Needs time to adjust</option>
                            <option value="4">Not social</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editTrainingLevel">Training Level:</label>
                        <select id="editTrainingLevel" required>
                            <option value="${profile.trainingLevel}" selected>${profile.trainingLevel}</option>
                            <option value="1">Fully trained</option>
                            <option value="2">Advanced training</option>
                            <option value="3">Basic commands</option>
                            <option value="4">Untrained</option>
                            <option value="5">Housebroken</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editSex">Sex:</label>
                        <select id="editSex" required>
                            <option value="${profile.sex}" selected>${profile.sex}</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editNeutered">Neutered/Spayed:</label>
                        <select id="editNeutered" required>
                            <option value="${profile.neutered}" selected>${profile.neutered}</option>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <button id="saveProfileButton">Save Changes</button>
                </div>
            `;

            dogProfilesDiv.appendChild(profileDiv);
            attachExpandListeners(profile);

            // Add event listener for the file input
            document.getElementById("dogPhotoInput").addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        profile.photo = e.target.result; // Store the photo in the profile
                        document.getElementById("dogPhoto").src = profile.photo; // Update the image source
                        document.getElementById("dogPhoto").style.display = 'block'; // Show the image
                    };
                    reader.readAsDataURL(file); // Read the file as a data URL
                }
            });

            // Add event listener for the edit button
            document.getElementById("editProfileButton").addEventListener("click", () => {
                document.getElementById("editProfileForm").style.display = "block"; // Show the edit form
            });

            // Add delete functionality for services, memberships, and payments
            attachDeleteListeners(profile);

            // Add event listener for the save button
            document.getElementById("saveProfileButton").addEventListener("click", (event) => {
                event.preventDefault(); // Prevent the default form submission

                // Capture updated values from the form
                profile.personality = document.getElementById("editPersonality").value;
                profile.behavior = document.getElementById("editBehavior").value;
                profile.energyLevel = document.getElementById("editEnergyLevel").value;
                profile.compatibility = document.getElementById("editCompatibility").value;
                profile.activityPreferences = document.getElementById("editActivityPreferences").value;
                profile.socializationLevel = document.getElementById("editSocializationLevel").value;
                profile.trainingLevel = document.getElementById("editTrainingLevel").value;
                profile.sex = document.getElementById("editSex").value;
                profile.neutered = document.getElementById("editNeutered").value;
                profile.birthday = document.getElementById("editBirthday").value;

                // Save the updated profile to localStorage
                saveProfilesToDynamoDB();

                // Re-render the profiles to reflect the changes
                renderProfiles();
            });

            // Add event listener for the delete button
            document.getElementById("deleteProfileButton").addEventListener("click", () => {
                if (confirm("Are you sure you want to delete this profile?")) {
                    deleteProfile(dogId); // Call the delete function
                }
            });
        }
    };

    // Function to delete a profile
    const deleteProfile = (dogId) => {
        delete dogProfiles[dogId]; // Remove the profile from the object
        saveProfilesToDynamoDB(); // Save changes to localStorage
        renderProfiles(); // Re-render profiles to reflect the changes
    };

    // Function to attach delete listeners to each item
    const attachDeleteListeners = (profile) => {
        const serviceItems = document.querySelectorAll(".service-item");
        serviceItems.forEach((item, index) => {
            item.querySelector(".delete-service").addEventListener("click", () => {
                if (confirm("Are you sure you want to delete this service?")) { // Confirmation popup
                    const servicePrice = profile.services[index].price;
                    profile.services.splice(index, 1); // Remove the service
                    profile.amountOwed -= servicePrice; // Update amount owed
                    renderProfiles(); // Re-render profiles to reflect changes
                    saveProfilesToDynamoDB(); // Save changes to localStorage
                }
            });
        });

        const membershipItems = document.querySelectorAll(".membership-item");
        membershipItems.forEach((item, index) => {
            item.querySelector(".delete-membership").addEventListener("click", () => {
                if (confirm("Are you sure you want to delete this membership?")) { // Confirmation popup
                    const membershipPrice = profile.memberships[index].price;
                    profile.memberships.splice(index, 1); // Remove the membership
                    profile.amountOwed -= membershipPrice; // Update amount owed
                    renderProfiles(); // Re-render profiles to reflect changes
                    saveProfilesToDynamoDB(); // Save changes to localStorage
                }
            });
        });

        const paymentItems = document.querySelectorAll(".payment-item");
        paymentItems.forEach((item, index) => {
            item.querySelector(".delete-payment").addEventListener("click", () => {
                if (confirm("Are you sure you want to delete this payment?")) { // Confirmation popup
                    const paymentAmount = profile.payments[index].paymentAmount;
                    profile.payments.splice(index, 1); // Remove the payment
                    profile.amountOwed += paymentAmount; // Update amount owed
                    renderProfiles(); // Re-render profiles to reflect changes
                    saveProfilesToDynamoDB(); // Save changes to localStorage
                }
            });
        });
    };

    // Update the createExpandableSection function to include delete buttons
    const createExpandableSection = (items, sectionName) => {
        const initialItems = items.slice(0, 30);
        const hasMoreItems = items.length > 30;

        const itemsHtml = initialItems
            .map((item, index) => renderItemHtml(item, sectionName.toLowerCase(), index))
            .join("");

        return `
            <div class="expandable-section">
                <h4>${sectionName} <button class="toggle-expand">Show</button></h4>
                <div class="expandable-content" style="display: none;">
                    ${itemsHtml || `<p>No ${sectionName.toLowerCase()} recorded.</p>`}
                    ${
                        hasMoreItems
                            ? `<button class="load-more" data-section="${sectionName.toLowerCase()}">Load More</button>`
                            : ""
                    }
                </div>
            </div>
        `;
    };

    // Update the renderItemHtml function to include delete buttons
    const renderItemHtml = (item, sectionType, index) => {
        if (sectionType === "services") {
            let serviceDetails = `${item.serviceType} - $${item.price.toFixed(2)} (`;

            if (item.serviceType === "hotel") {
                // Calculate the number of nights
                const checkInDate = new Date(item.checkInDate);
                const checkOutDate = new Date(item.checkOutDate);
                const timeDiff = checkOutDate - checkInDate;
                const nights = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days
                serviceDetails += `${nights} nights, ${item.checkInDate} to ${item.checkOutDate})`;
                serviceDetails += ` | Days: ${nights}`; // Add total days
            } else if (item.serviceType === "daycare" || item.serviceType === "daycare extra hours") {
                // Calculate the total hours for daycare
                const checkInTime = new Date(`1970-01-01T${item.checkInTime}:00`);
                const checkOutTime = new Date(`1970-01-01T${item.checkOutTime}:00`);
                const hoursDiff = (checkOutTime - checkInTime) / (1000 * 3600); // Convert milliseconds to hours
                serviceDetails += `${item.serviceDate}, ${item.checkInTime} to ${item.checkOutTime})`; // Updated format
                if (item.serviceType === "daycare extra hours") {
                    serviceDetails += ` | Extra Hours: ${item.extraHours.toFixed(2)}`; // Display extra hours from the service object
                } else {
                    serviceDetails += ` | Hours: ${hoursDiff.toFixed(2)}`; // Changed to 2 decimal places
                }
            } else if (item.serviceType === "training" || item.serviceType === "grooming") {
                // For training and grooming, include the service date
                serviceDetails += `${item.serviceDate})`; // Add the service date
            }

            return `<p class="service-item">${serviceDetails} <button class="delete-service">Delete</button></p>`;
        } else if (sectionType === "memberships") {
            // Include the price in the membership display
            return `<p class="membership-item">${item.serviceType} - $${item.price.toFixed(2)} - Passes: ${item.passesLeft}/${item.numberOfPasses} (Expires: ${item.expiryDate}) <button class="delete-membership">Delete</button></p>`;
        } else if (sectionType === "payments") {
            return `<p class="payment-item">Payment: $${item.paymentAmount.toFixed(2)} (${item.paymentDate}) <button class="delete-payment">Delete</button></p>`;
        }
        return "";
    };

    const attachExpandListeners = (profile) => {
        const toggleButtons = document.querySelectorAll(".toggle-expand");
        toggleButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
                const content = event.target.closest(".expandable-section").querySelector(".expandable-content");
                const isExpanded = content.style.display === "block";
                content.style.display = isExpanded ? "none" : "block";
                event.target.textContent = isExpanded ? "Show" : "Hide";
            });
        });
    };

    const createNavigation = () => {
        const nav = document.createElement("nav");
        nav.innerHTML = `
            <ul>

            </ul>
        `;
        document.body.insertBefore(nav, document.body.firstChild);
    };

    // Call the function to create the navigation
    createNavigation();

    dogOwnerForm.addEventListener("submit", addDog);
    serviceForm.addEventListener("submit", addService);
    membershipForm.addEventListener("submit", addMembershipPasses);
    paymentForm.addEventListener("submit", recordPayment);
    dogSelect.addEventListener("change", updatePassInfo);
    document.getElementById("serviceType").addEventListener("change", updatePassInfo);
    profileDogSelect.addEventListener("change", renderProfiles);
});

document.querySelectorAll('.toggle-expand').forEach(button => {
    button.addEventListener('click', (event) => {
        const content = event.target.closest('h2').nextElementSibling;
        const isExpanded = content.style.display === 'block';
        content.style.display = isExpanded ? 'none' : 'block';
        event.target.textContent = isExpanded ? 'Show' : 'Hide';
    });
});

console.log(dogProfiles); // Check the structure of the dog profiles

// Function to save profile changes
const saveProfileChanges = (profileId) => {
    const profile = dogProfiles[profileId]; // Get the profile object

    // Logic to gather updated values from input fields
    const updatedOwnerName = document.getElementById("editOwnerName").value;

    // Update the profile object
    profile.ownerName = updatedOwnerName;

    // Update the dogId based on the new owner name
    const newDogId = `${profile.dogName} (${updatedOwnerName})`;
    if (newDogId !== profileId) {
        // Remove the old entry and add the new one
        delete dogProfiles[profileId];
        dogProfiles[newDogId] = profile; // Assign the updated profile to the new dogId
    }

    // Save the updated profile to localStorage
    saveProfilesToDynamoDB();

    // Re-render the profiles to reflect the changes
    renderProfiles();
    renderProfileDropdown(); // Ensure dropdown is updated
};

// Function to render the profile dropdown
const renderProfileDropdown = () => {
    const dogOptions = Object.keys(dogProfiles)
        .sort((a, b) => {
            const dogNameA = a.split(" (")[0];
            const dogNameB = b.split(" (")[0];
            return dogNameA.localeCompare(dogNameB);
        })
        .map(dogId => `<option value="${dogId}">${dogId}</option>`)
        .join("");

    dogSelect.innerHTML = `<option value="" disabled selected>Select a dog</option>${dogOptions}`;
    membershipDogSelect.innerHTML = `<option value="" disabled selected>Select a dog</option>${dogOptions}`;
    paymentDogSelect.innerHTML = `<option value="" disabled selected>Select a dog</option>${dogOptions}`;
    profileDogSelect.innerHTML = `<option value="" disabled selected>Select a dog</option>${dogOptions}`;
};

// Call this function when the profile is loaded or updated
const loadProfileForEditing = (profileId) => {
    const profile = dogProfiles[profileId];
    if (profile) {
        document.getElementById("editOwnerName").value = profile.ownerName;
        // Other fields can be populated similarly
    }
};

// Example of how to call loadProfileForEditing when editing a profile
// This should be called when you open the edit form for a specific profile
// loadProfileForEditing(selectedProfileId);
