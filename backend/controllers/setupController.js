import client from "../redis.js";

/*
========================================
REDISCART SETUP PRODUCT PROFILES
========================================
*/

const compatibilityProfiles = {
    1: {
        role: "computer",
        capabilities: [
            "portable",
            "bluetooth",
            "usb-c",
            "productivity",
            "apple"
        ],
        worksWith: [
            "audio",
            "accessory",
            "mobile",
            "tablet"
        ]
    },

    2: {
        role: "computer",
        capabilities: [
            "portable",
            "bluetooth",
            "usb-c",
            "usb",
            "productivity",
            "windows"
        ],
        worksWith: [
            "audio",
            "accessory",
            "mobile",
            "tablet"
        ]
    },

    3: {
        role: "mobile",
        capabilities: [
            "bluetooth",
            "usb-c",
            "portable",
            "apple"
        ],
        worksWith: [
            "audio",
            "accessory"
        ]
    },

    4: {
        role: "mobile",
        capabilities: [
            "bluetooth",
            "usb-c",
            "portable",
            "android"
        ],
        worksWith: [
            "audio",
            "accessory"
        ]
    },

    5: {
        role: "audio",
        capabilities: [
            "bluetooth",
            "wireless",
            "audio"
        ],
        worksWith: [
            "computer",
            "mobile",
            "tablet",
            "gaming"
        ]
    },

    6: {
        role: "gaming",
        capabilities: [
            "gaming",
            "console",
            "hdmi",
            "usb"
        ],
        worksWith: [
            "audio",
            "accessory"
        ]
    },

    7: {
        role: "gaming",
        capabilities: [
            "gaming",
            "console",
            "hdmi",
            "usb"
        ],
        worksWith: [
            "audio",
            "accessory"
        ]
    },

    8: {
        role: "tablet",
        capabilities: [
            "portable",
            "bluetooth",
            "usb-c",
            "apple"
        ],
        worksWith: [
            "audio",
            "accessory",
            "mobile"
        ]
    },

    9: {
        role: "audio",
        capabilities: [
            "bluetooth",
            "wireless",
            "audio",
            "portable"
        ],
        worksWith: [
            "computer",
            "mobile",
            "tablet",
            "gaming"
        ]
    },

    10: {
        role: "accessory",
        capabilities: [
            "bluetooth",
            "wireless",
            "productivity"
        ],
        worksWith: [
            "computer",
            "mobile",
            "tablet"
        ]
    },

    11: {
        role: "accessory",
        capabilities: [
            "bluetooth",
            "wireless",
            "usb",
            "productivity"
        ],
        worksWith: [
            "computer",
            "mobile",
            "tablet"
        ]
    }
};


/*
========================================
SETUP GOAL DEFINITIONS
========================================
*/

const setupGoals = {

    general: {
        name: "Custom Setup",

        requiredRoles: [
            "computer",
            "mobile",
            "tablet",
            "gaming"
        ],

        supportingRoles: [
            "audio",
            "accessory"
        ]
    },

    student: {
        name: "Student Setup",

        requiredRoles: [
            "computer",
            "tablet"
        ],

        supportingRoles: [
            "mobile",
            "audio",
            "accessory"
        ]
    },

    gaming: {
        name: "Gaming Setup",

        requiredRoles: [
            "gaming"
        ],

        supportingRoles: [
            "audio",
            "accessory"
        ]
    },

    work: {
        name: "Work Setup",

        requiredRoles: [
            "computer"
        ],

        supportingRoles: [
            "audio",
            "accessory"
        ]
    },

    content: {
        name: "Content Creation Setup",

        requiredRoles: [
            "computer"
        ],

        supportingRoles: [
            "audio",
            "accessory",
            "tablet"
        ]
    }
};


/*
========================================
SAVE PRODUCT PROFILES TO REDIS
========================================
*/

async function saveProductProfiles() {

    for (const [productId, profile] of Object.entries(compatibilityProfiles)) {

        await client.hSet(
            `setup:product:${productId}`,
            {
                role: profile.role,
                capabilities: JSON.stringify(profile.capabilities),
                worksWith: JSON.stringify(profile.worksWith)
            }
        );
    }
}


/*
========================================
GET PRODUCT PROFILE
========================================
*/

async function getProductProfile(productId) {

    const profile = await client.hGetAll(
        `setup:product:${productId}`
    );

    if (!profile || !profile.role) {
        return null;
    }

    return {
        role: profile.role,

        capabilities: profile.capabilities
            ? JSON.parse(profile.capabilities)
            : [],

        worksWith: profile.worksWith
            ? JSON.parse(profile.worksWith)
            : []
    };
}


/*
========================================
ANALYZE SETUP
========================================
*/

export async function analyzeSetup(req, res) {

    try {

        /*
        ----------------------------------------
        READ REQUEST DATA
        ----------------------------------------
        */

        const {
            productIds = [],
            setupType = "general",
            budget
        } = req.body;


        /*
        ----------------------------------------
        VALIDATE PRODUCTS
        ----------------------------------------
        */

        if (!Array.isArray(productIds) || productIds.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Please select at least one product."

            });

        }


        /*
        ----------------------------------------
        GET GOAL
        ----------------------------------------
        */

        const goal = setupGoals[setupType] || setupGoals.general;


        /*
        ----------------------------------------
        SAVE PROFILES
        ----------------------------------------
        */

        await saveProductProfiles();


        /*
        ----------------------------------------
        GET PRODUCTS FROM REDIS
        ----------------------------------------
        */

        const productsData = await client.get("products");

        if (!productsData) {

            return res.status(500).json({

                success: false,

                message: "Products not found in Redis."

            });

        }


        const products = JSON.parse(productsData);


        /*
        ----------------------------------------
        GET SELECTED PRODUCTS
        ----------------------------------------
        */

        const selectedProducts = products.filter(product =>

            productIds.map(String).includes(
                String(product.id)
            )

        );


        if (selectedProducts.length === 0) {

            return res.status(400).json({

                success: false,

                message: "Selected products could not be found."

            });

        }


        /*
        ----------------------------------------
        CALCULATE CURRENT COST
        ----------------------------------------
        */

        const currentCost = selectedProducts.reduce(

            (total, product) =>

                total + Number(product.price || 0),

            0

        );


        /*
        ----------------------------------------
        BUDGET
        ----------------------------------------
        
        IMPORTANT:
        Budget 0 is a REAL budget.

        Example:

        Budget = ₹0
        Cost   = ₹1,09,998

        Therefore:

        budgetExceeded = true
        budgetScore = 0
        */

        const numericBudget = Number(budget);

        const finalBudget =
            Number.isFinite(numericBudget)
                ? numericBudget
                : 0;


        const budgetExceeded =
            currentCost > finalBudget;


        const budgetScore =
            budgetExceeded
                ? 0
                : 10;


        /*
        ----------------------------------------
        GET PROFILES FOR SELECTED PRODUCTS
        ----------------------------------------
        */

        const selectedWithProfiles = [];

        for (const product of selectedProducts) {

            const profile =
                await getProductProfile(product.id);

            if (profile) {

                selectedWithProfiles.push({

                    product,

                    profile

                });

            }

        }


        /*
        ----------------------------------------
        IDENTIFY PRODUCT ROLES
        ----------------------------------------
        */

        const roles = selectedWithProfiles.map(
            item => item.profile.role
        );


        const primaryProfiles =
            selectedWithProfiles.filter(item =>

                goal.requiredRoles.includes(
                    item.profile.role
                )

            );


        const supportingProfiles =
            selectedWithProfiles.filter(item =>

                goal.supportingRoles.includes(
                    item.profile.role
                )

            );


        /*
        ========================================
        1. GOAL RELEVANCE SCORE
        ========================================
        
        If the user selected a product that
        actually belongs to the chosen goal,
        the goal is relevant.

        Example:

        Content Creation + MacBook
        = relevant

        Content Creation + PS5
        = not relevant
        */

        let goalScore = 0;


        if (primaryProfiles.length > 0) {

            goalScore = 40;

        }


        /*
        ========================================
        2. COMPLETENESS SCORE
        ========================================
        
        A setup needs a primary device.

        Laptop alone:
        COMPLETE

        Laptop + keyboard:
        COMPLETE

        Keyboard + mouse:
        INCOMPLETE

        PS5 + headphones for Gaming:
        COMPLETE
        */

        let completenessScore = 0;

        const setupComplete =
            primaryProfiles.length > 0;


        if (setupComplete) {

            completenessScore = 25;

        }


        /*
        ========================================
        3. COMPATIBILITY SCORE
        ========================================
        
        IMPORTANT:

        We do NOT compare every product with
        every other product.

        Example:

        Laptop + Keyboard + Mouse

        Keyboard and Mouse are both accessories.
        They don't need to be compared against
        each other.

        We check whether supporting products
        make sense with at least one primary
        product.

        Multiple primary products can coexist.

        Example:

        Laptop + PS5

        They are not automatically incompatible.
        They simply serve different purposes.
        */

        let compatibilityScore = 25;

        const conflicts = [];


        if (primaryProfiles.length > 0) {

            for (const supporting of supportingProfiles) {

                const worksWithPrimary =
                    primaryProfiles.some(primary =>

                        supporting.profile.worksWith.includes(
                            primary.profile.role
                        )

                    );


                if (!worksWithPrimary) {

                    compatibilityScore -= 10;


                    conflicts.push({

                        product:
                            supporting.product.name,

                        reason:
                            `${supporting.product.name} does not have a clear compatibility relationship with the selected primary products.`

                    });

                }

            }

        }


        /*
        ----------------------------------------
        KEEP SCORE BETWEEN 0 AND 25
        ----------------------------------------
        */

        compatibilityScore =
            Math.max(
                0,
                Math.min(25, compatibilityScore)
            );


        /*
        ========================================
        TOTAL SCORE
        ========================================
        */

        const score =
            goalScore +
            completenessScore +
            compatibilityScore +
            budgetScore;


        /*
        ========================================
        COLLECT CAPABILITIES
        ========================================
        */

        const capabilities = [

            ...new Set(

                selectedWithProfiles.flatMap(item =>

                    item.profile.capabilities

                )

            )

        ];


        /*
        ========================================
        STORE CAPABILITIES IN REDIS SET
        ========================================
        */

        const capabilityKey =
            `setup:capabilities:${Date.now()}`;


        if (capabilities.length > 0) {

            await client.sAdd(
                capabilityKey,
                capabilities
            );

            /*
            Keep temporary analysis data
            for 24 hours.
            */

            await client.expire(
                capabilityKey,
                86400
            );

        }


        /*
        ========================================
        STORE LAST ANALYSIS
        ========================================
        */

        await client.hSet(

            "setup:last-analysis",

            {

                setupType,

                goal: goal.name,

                productIds:
                    JSON.stringify(productIds),

                productCount:
                    String(selectedProducts.length),

                currentCost:
                    String(currentCost),

                budget:
                    String(finalBudget),

                remaining:
                    String(finalBudget - currentCost),

                score:
                    String(score),

                goalScore:
                    String(goalScore),

                completenessScore:
                    String(completenessScore),

                compatibilityScore:
                    String(compatibilityScore),

                budgetScore:
                    String(budgetScore),

                setupComplete:
                    String(setupComplete),

                budgetExceeded:
                    String(budgetExceeded),

                compatible:
                    String(conflicts.length === 0),

                analyzedAt:
                    new Date().toISOString()

            }

        );


        /*
        ========================================
        STORE SETUP RANKING
        ========================================
        
        Redis Sorted Set

        Higher score = better setup
        */

        await client.zAdd(

            "setup:compatibility:ranking",

            {

                score,

                value:
                    JSON.stringify({

                        productIds,

                        setupType,

                        score

                    })

            }

        );


        /*
        ========================================
        GENERATE SUGGESTIONS
        ========================================
        */

        const suggestions = [];


        /*
        No primary product
        */

        if (primaryProfiles.length === 0) {

            if (setupType === "student") {

                suggestions.push(
                    "Add a laptop or tablet to create a complete student setup."
                );

            }

            else if (setupType === "gaming") {

                suggestions.push(
                    "Add a gaming console such as PS5 or Xbox."
                );

            }

            else if (setupType === "work") {

                suggestions.push(
                    "Add a laptop or computer for a complete work setup."
                );

            }

            else if (setupType === "content") {

                suggestions.push(
                    "Add a laptop or computer suitable for content creation."
                );

            }

            else {

                suggestions.push(
                    "Add a primary device such as a laptop, tablet, mobile, or gaming console."
                );

            }

        }


        /*
        Optional recommendations

        These DO NOT reduce the score.

        They are simply suggestions.
        */

        if (
            primaryProfiles.length > 0 &&
            supportingProfiles.length === 0
        ) {

            if (setupType === "gaming") {

                suggestions.push(
                    "Consider adding headphones or other gaming accessories."
                );

            }

            else if (
                setupType === "student" ||
                setupType === "work"
            ) {

                suggestions.push(
                    "Consider adding a keyboard, mouse, or headphones if needed."
                );

            }

            else if (setupType === "content") {

                suggestions.push(
                    "Consider adding headphones, a keyboard, or a mouse for a more comfortable workflow."
                );

            }

        }


        /*
        Budget suggestion
        */

        if (budgetExceeded) {

            suggestions.push(

                `Reduce the setup cost by ₹${(
                    currentCost - finalBudget
                ).toLocaleString("en-IN")} to stay within your budget.`

            );

        }


        /*
        ========================================
        FINAL RESPONSE
        ========================================
        */

        return res.json({

            success: true,

            message: "Setup analysis completed.",

            score,

            goalScore,

            completenessScore,

            compatibilityScore,

            budgetScore,

            compatible:
                conflicts.length === 0,

            setupComplete,

            budgetExceeded,

            productCount:
                selectedProducts.length,

            currentCost,

            budget:
                finalBudget,

            remaining:
                finalBudget - currentCost,

            roles,

            capabilities,

            conflicts,

            suggestions,

            setupType,

            goal:
                goal.name

        });


    }

    catch (error) {

        console.error(
            "Setup Analysis Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to analyze setup.",

            error:
                error.message

        });

    }

}