var currentURL = window.location.href;

if (!/\/subscriptions$/.test(currentURL)) {
    var subscriptionURL = window.location.protocol + "//"
                            + window.location.host
                            + "/subscriptions";

    window.location.replace(subscriptionURL);
}