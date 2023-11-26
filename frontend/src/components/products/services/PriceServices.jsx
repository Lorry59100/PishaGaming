export function convertToEuros(priceInCents) {
    // Check if the price is a valid number
    if (isNaN(priceInCents) || priceInCents < 0) {
        return "Invalid price";
    }
    // Convert cents to euros and format with two decimal places
    var priceInEuros = (priceInCents / 100).toFixed(2);
    // Add the euro symbol
    return priceInEuros;
}

export function calculateDiscountPercentage(oldPriceInCents, priceInCents) {
    // Vérifier si les prix sont des nombres valides et non négatifs
    if (isNaN(oldPriceInCents) || isNaN(priceInCents) || oldPriceInCents < 0 || priceInCents < 0) {
        return "Invalid prices";
    }
    // Convertir les centimes en euros avant le calcul
    var oldPriceInEuros = convertToEuros(oldPriceInCents);
    var priceInEuros = convertToEuros(priceInCents);
    // Calculer le pourcentage de remise
    var discountPercentage = ((oldPriceInEuros - priceInEuros) / oldPriceInEuros) * 100;
    // Formater le résultat avec deux décimales et ajouter le symbole de pourcentage
    return discountPercentage.toFixed(0) + "%";
}
