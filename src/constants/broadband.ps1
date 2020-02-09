#Install-Module -Name SPE -RequiredVersion 4.7 -Repository SitecoreGallery

$sitecoreUsername = 'admin'
$sitecorePassword = 'b'
$sitecoreConnectionUri = 'https://boingo.local'

$session = New-ScriptSession -Username $sitecoreUsername -Password $sitecorePassword -ConnectionUri $sitecoreConnectionUri

$remoteScript = {
    # add venues json skeleton
    $broadbandCatalog = [PSCustomObject]@{
        #Name = 'mccpen'
        #Room = [PSCustomObject]@{
        #    pages = [PSCustomObject]@{}
        #    options = [PSCustomObject]@{}
        #}
    }

    # add venues json skeleton
    $broadbandVenues = [PSCustomObject]@{
        #venue_name = $venueItem['base-name']
        #gloop_venue_id = $venueItem['gloop-venue-id']
        #network_id = $venueItem['network-id']
        #associated_plan_type = $venueItem['associated-plan-type']
        #areas_and_buildings = [PSCustomObject]@{}
    }

    # add venues json skeleton
    $broadbandProducts = [PSCustomObject]@{
        #product_name = [PSCustomObject]@{}
    }

    # add venues json skeleton
    $wifiProducts = [PSCustomObject]@{
        #product_name = [PSCustomObject]@{}
    }

    # change spaces and dashes to underscores
    function ToJsonKey {
        param( $Name )
        $Name.ToLower().Replace(' ','_').Replace('-','_')
    }

    # To Bypass Context Error:
    # Get-Rendering : Current Sitecore database cannot be established, current location is not within a Sitecore content tree.
    # @see {@link https://sitecore.stackexchange.com/questions/2574/getting-current-sitecore-database-cannot-be-established-using-sitecore-powersh}
    Set-Location master:

    # cycle through all venues to get dependency list
    foreach ($product in Get-ChildItem -Path "master:/sitecore/content/Wifi/Data/Products") {
        $productName = $product['product-code']

        # add to proudcts (broadband) if not null
        if ($productName) {
            Add-Member -InputObject $wifiProducts -Force -NotePropertyMembers @{$productName=[PSCustomObject]@{
                name = $product.Name # must be lower case since this is a field on the item not the item Name
                product_code = $product['product-code']
                product_price = $product['product-price']
                currency = $(if($product['currency']) {(Get-Item $product['currency']).Name} else {''})
                account_type = $(if($product['account-type']) {(Get-Item $product['account-type']).Name} else {''})
                downgrade_product = $(if($product['downgrade-product']) {(Get-Item $product['downgrade-product'])['product-code']} else {''})
                upgrade_product = $(if($product['upgrade-product']) {(Get-Item $product['upgrade-product'])['product-code']} else {''})
                selfcare_title = $product['selfcare-title']
                selfcare_description = $product['selfcare-description']
                ga_category = $product['ga-category']
            }}
        }
    }

    # cycle through all venues to get dependency list
    foreach ($product in (Get-ChildItem -Path "master:/sitecore/content/Broadband/Sales Data/Products" | Sort-Object -Descending {$_['product-code'].Split(',').Length})) {
        $productName = $product['product-code']

        # add to proudcts (broadband)
        if ($productName) {
            Add-Member -InputObject $broadbandProducts -Force -NotePropertyMembers @{$productName=[PSCustomObject]@{
                item_name = $product.Name
                name = $product['name'] # must be lower case since this is a field on the item not the item Name
                product_codes = $product['product-code'].Split(',')
                price = $product.price
                duration = $product.duration
                currency = $product.currency
                description = $product.description
                sort_order = $product['sort-order']
                ga_category = $product['ga-category']
                ga_variant = $product['ga-variant']
            }}
        }
    }

    # get sales flow presentation details that stores the start of the flow
    $rendering = Get-Item -Path "master:/sitecore/layout/Renderings/Broadband/Sales Flow"

    # cycle through all venues to get dependency list
    foreach ($venueChangePlan in Get-ChildItem -Path "master:/sitecore/content/Selfcare/ChangePlan") {
        $venueId = ToJsonKey($venueChangePlan.Name)
        # get venue instead of change plan venue
        $venueItem = Get-Item -Path "master:/sitecore/content/Broadband/Venues/$venueId"
        $venueName = $venueItem['base-name']

        # pull in areas and buildings
        $areasAndBuildings=[PSCustomObject]@{}
        foreach ($area in $venueItem.Children['Areas and Buildings'].Children) {
            # API expects friendly name hence we cannot use normalized name
            Add-Member -InputObject $areasAndBuildings -NotePropertyMembers @{$area.Name=$area['Buildings'].Split("`n").Replace("`r","")}
        }
    
        # add to venues (broadband)
        Add-Member -InputObject $broadbandVenues -Force -NotePropertyMembers @{$venueName=[PSCustomObject]@{
            venue_id = $venueId
            venue_name = $venueItem['base-name']
            gloop_venue_id = $venueItem['gloop-venue-id']
            network_id = $venueItem['network-id']
            associated_plan_type = $venueItem['associated-plan-type']
            areas_and_buildings = $areasAndBuildings
        }}

        # add to product catalog
        Add-Member -InputObject $broadbandCatalog -Force -NotePropertyMembers @{$venueName=[PSCustomObject]@{
            Name = $venueId
            Room = [PSCustomObject]@{
                pages = [PSCustomObject]@{}
                options = [PSCustomObject]@{}
            }
        }}

        # add venue dictionary content
        $renderingInstance = Get-Rendering -Item $venueChangePlan -Rendering $rendering

        if ($renderingInstance) {
            # set venue to current venue
            $venue = $broadbandCatalog.$venueName
    
            foreach ($page in Get-ChildItem -Path $renderingInstance.Datasource) {
                $pageName = ToJsonKey($page.Name)
                Add-Member -InputObject $venue.Room.pages -NotePropertyName $pageName -NotePropertyValue @()
                foreach ($optionId in $page.options -split '\|') {
                    $option = Get-Item -Path $optionId
                    $optionName = ToJsonKey($option.Name)
                    # normalize option name to known standard values
                    # replace any internet option with internet___basic_std_exp
                    $optionName = $(if ($pageName -eq 'internet_sales') {'internet___basic_std_exp'} else {$optionName})
                    # add options to pages
                    $venue.Room.pages.$pageName += $optionName
                    # add options to options list
                    Add-Member -InputObject $venue.Room.options -NotePropertyMembers @{$optionName=[PSCustomObject]@{
                        requires = [PSCustomObject]@{}
                        choices = [PSCustomObject]@{}
                    }}
                    # add requirements
                    foreach ($requiredChoiceId in $option.requires -split '\|') {
                        if ($requiredChoiceId) {
                            $requiredChoice = Get-Item $requiredChoiceId
                            $requiredOption = $requiredChoice.Parent
                        
                            $requiredOptionName = ToJsonKey($requiredOption.Name)
                            $requiredChoiceName = ToJsonKey($requiredChoice.Name)
                        
                            if ($venue.Room.options.$optionName.requires.$requiredOptionName) {
                                $venue.Room.options.$optionName.requires.$requiredOptionName += $requiredChoiceName
                            }
                            else {
                                Add-Member -InputObject $venue.Room.options.$optionName.requires -NotePropertyMembers @{$requiredOptionName=@(
                                    $requiredChoiceName
                                )}
                            }
                        }
                    }
                    # add choices
                    foreach ($choice in Get-ChildItem -Path $optionId) {
                        # add choice
                        $choiceName = ToJsonKey($choice.Name)
                        # normalize choice name to known standard values
                        switch ($choiceName) {
                            {$_ -in 'internet___free_extra','internet___free_standard'} {
                                $choiceName = 'internet___basic'
                                break
                            }
                            {$_ -in 'internet___extra','internet___reduced_expanded'} {
                                $choiceName = 'internet___standard'
                                break
                            }
                            {$_ -in 'internet___blazing','internet___reduced_blazing'} {
                                $choiceName = 'internet___expanded'
                                break
                            }
                        }
                        Add-Member -InputObject $venue.Room.options.$optionName.choices -NotePropertyMembers @{$choiceName=[PSCustomObject]@{}}
                        #$choice
                        foreach ($product in $choice.products -split '\|' | Get-Item) {
                            $durationName = ToJsonKey($product.duration)
                            Add-Member -InputObject $venue.Room.options.$optionName.choices.$choiceName -NotePropertyMembers @{$durationName=[PSCustomObject]@{
                                name = $product['name']
                                product_codes = $product['product-code'].Split(',')
                                price = $product.price
                                duration = $durationName
                                currency_symbol = $(If ($product.currency -eq 'USD') {'$'} Else {''})
                                currency = $product.currency
                                ga_category = $product['ga-category']
                                ga_variant = $product['ga-variant']
                            }}
                        }
                    }
                }
            }
        }
    }

    [PSCustomObject]@{
        WifiProducts = $wifiProducts
        BroadbandProducts = $broadbandProducts
        BroadbandVenues = $broadbandVenues
        BroadbandCatalog = $broadbandCatalog
    }
}

# Formats JSON in a nicer format than the built-in ConvertTo-Json does.
#
# Usage: $foo | ConvertTo-Json | Format-Json
#
# @see {@link https://stackoverflow.com/questions/33145377/how-to-change-tab-width-when-converting-to-json-in-powershell}
# @see {@link https://jsonformatter.org}
# NOTE: modified the original by adding `r`n vs `n for dos EOL formatting
function Format-Json([Parameter(Mandatory, ValueFromPipeline)][String] $json) {
    $indent = 0
    ($json -Split "`r`n" | ForEach-Object {
        if ($_ -match '[\}\]]\s*,?\s*$') {
            # This line ends with ] or }, decrement the indentation level
            $indent--
        }
        $line = ('  ' * $indent) + $($_.TrimStart() -replace '":  (["{[])', '": $1' -replace ':  ', ': ')
        if ($_ -match '[\{\[]\s*$') {
            # This line ends with [ or {, increment the indentation level
            $indent++
        }
        $line
    }) -Join "`r`n"
}

# turn off script validation
[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}

#Execute the doneScript and check the response.
$response = Invoke-RemoteScript -Session $session -ScriptBlock $remoteScript

$responseWifiProductsJson =
    "/**`r`n" +
    " * Wifi products object used for content lookups sourced from Sitecore`r`n" +
    " * NOTE: generated by broadband.ps1`r`n" +
    " */`r`n" +
    "export const WIFI_PRODUCTS =`r`n" +
    (ConvertTo-Json -InputObject $response.WifiProducts -Depth 8 | Format-Json)

$responseBroadbandProductsJson =
    "/**`r`n" +
    " * Broadband products object used for content lookups sourced from Sitecore`r`n" +
    " * NOTE: generated by broadband.ps1`r`n" +
    " */`r`n" +
    "export const BROADBAND_PRODUCTS =`r`n" +
    (ConvertTo-Json -InputObject $response.BroadbandProducts -Depth 8 | Format-Json)

$responseBroadbandVenuesJson =
    "/**`r`n" +
    " * Broadband venues object used for content lookups sourced from Sitecore`r`n" +
    " * NOTE: generated by broadband.ps1`r`n" +
    " */`r`n" +
    "export const BROADBAND_VENUES =`r`n" +
    (ConvertTo-Json -InputObject $response.BroadbandVenues -Depth 8 | Format-Json)

$responseBroadbandCatalogJson =
    "/**`r`n" +
    " * Broadband product catalog object used for content lookups sourced from Sitecore`r`n" +
    " * NOTE: generated by broadband.ps1`r`n" +
    " */`r`n" +
    "export const BROADBAND_CATALOG =`r`n" +
    (ConvertTo-Json -InputObject $response.BroadbandCatalog -Depth 8 | Format-Json)

Out-File -Encoding ASCII -FilePath .\src\constants\wifi-products.const.js -InputObject $responseWifiProductsJson
Out-File -Encoding ASCII -FilePath .\src\constants\broadband-products.const.js -InputObject $responseBroadbandProductsJson
Out-File -Encoding ASCII -FilePath .\src\constants\broadband-venues.const.js -InputObject $responseBroadbandVenuesJson
Out-File -Encoding ASCII -FilePath .\src\constants\broadband-catalog.const.js -InputObject $responseBroadbandCatalogJson