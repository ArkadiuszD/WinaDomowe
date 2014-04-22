(function () {
    "use strict";


    var storage = Windows.Storage;
    var dtm = Windows.ApplicationModel.DataTransfer.DataTransferManager;
    var item;
    var capture = Windows.Media.Capture;
    var _photo;
    var _video;
    var start = Windows.UI.StartScreen;


    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
             item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-subtitle").textContent = item.preptime;
            element.querySelector("article .item-image").src = item.backgroundImage;
            element.querySelector("article .item-image").alt = item.shortTitle;
            var ingredients = element.querySelector("article .item-ingredients");
            for (var i = 0; i < item.ingredients.length; i++) {
                var ingredient = document.createElement("h2");
                ingredient.textContent = item.ingredients[i];
                ingredient.className = "ingredient";
                ingredients.appendChild(ingredient);
            }
            element.querySelector("article .item-directions").textContent = item.directions;
            element.querySelector(".content").focus();


            dtm.getForCurrentView().addEventListener("datarequested", this.onDataRequested);

           



           

            document.getElementById("pin").addEventListener("click", function (e) {
                var uri = new Windows.Foundation.Uri("ms-appx:///" + item.tileImage);

                var tile = new start.SecondaryTile(
                    item.key,                                    // Tile ID
                    item.shortTitle,                             // Tile short name
                    item.title,                                  // Tile display name
                    JSON.stringify(Data.getItemReference(item)), // Activation argument
                    start.TileOptions.showNameOnLogo,            // Tile options
                    uri                                          // Tile logo URI
                );

                tile.requestCreateAsync();
            });

        },

        onDataRequested: function (e) {
            var request = e.request;
            request.data.properties.title = item.title;

           
            

                request.data.properties.description = "Sposób przygotowania wina";

                // Share recipe text
                var recipe = "\r\nSkładniki\r\n\n\n" + item.ingredients.join("\r\n\n\n");
                recipe += ("\r\n\n\n\r\nOpis\r\n\n\n" + item.directions);
                request.data.setText(recipe);

                // Share recipe image
                var uri = item.backgroundImage;
                if (item.backgroundImage.indexOf("http://") != 0)
                    uri = "ms-appx:///" + uri;

                uri = new Windows.Foundation.Uri(uri);
                var reference = storage.Streams.RandomAccessStreamReference.createFromUri(uri);
                request.data.properties.thumbnail = reference;
                request.data.setBitmap(reference);
            
        },
        unload: function () {
            WinJS.Navigation.removeEventListener("datarequested", this.onDataRequested);
        }

    })
})();
