module.exports = (module_nos) => {
    const module = module_nos.toLowerCase(); 

    let forma = {
        "addbot": "Ajout de bot",
        "antiban": "Banissement d'utilisateur",
        "antilink": "Message contenant des liens",
        "antikick": "Expulsion de membre",
        "antispam": "Message contenant du spam"
    };

    return forma[module]; 
};
