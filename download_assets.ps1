# RakshaSetu - Stitch Assets Download Script (PowerShell / Curl)
# Project: Clean UI Refinement (ID: 14524892580037120383)

$TargetDir = "e:\innvoik yash frontend\stitch_assets"
if (!(Test-Path -Path $TargetDir)) {
    New-Item -ItemType Directory -Force -Path $TargetDir
}

$Assets = @(
    @{ Name = "RakshaSetu_Frontend_Master_Prompt.md"; Url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBKOARIhYXBwX2NvbXBhbmlvbl91c2VyX3VwbG9hZGVkX2ZpbGVzGmkKM3VzZXJfdXBsb2FkZWRfaHRtbF8wMDA2NWFlMTEyOWNjYTU4MDU3NjAyZTc0NjA2MmVlMxILEgcQk9LlpqgOGAGSASQKCnByb2plY3RfaWQSFkIUMTQ1MjQ4OTI1ODAwMzcxMjAzODM&filename=&opi=89354086" },
    @{ Name = "RakshaSetu_Shield_Logo.svg"; Url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWUxMTNkZGEzZWMwN2M0ZTQxZWJjMmM0NGY2EgsSBxCT0uWmqA4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUyNDg5MjU4MDAzNzEyMDM4Mw&filename=&opi=89354086" },
    @{ Name = "RakshaSetu_Shield_Logo_screenshot.png"; Url = "https://lh3.googleusercontent.com/aida/AEtjO1V6Hh5jDrtoauI6TRQM_XcoGdmo8s3RwTP482Ge6TFX_sSxzZGnglhzK7rtVYltSseNi9cJtTGtOeXq0CF94T_eJ-NcSvxki49bmOBAOilz6Pe9Gp3VAOl_FnRuwCr28snnEHYa9Aq7zAGZkqMaySHJHYlf9WBQ3Sy_VtosKNepJBV1ONqrP8BQ9RmvvmgAtCuvOcey1ZNrOFxT2SijKNNtYB-8sFRTJoh3XlEcOJC_mSab9NICde7kilk" },
    @{ Name = "Government_Command_Center_Overview_Dashboard.html"; Url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWUxNTU5MDQ0MjQwMWE2MzE4ZGM5MDc5NWY3EgsSBxCT0uWmqA4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUyNDg5MjU4MDAzNzEyMDM4Mw&filename=&opi=89354086" },
    @{ Name = "Government_Command_Center_Overview_Dashboard.png"; Url = "https://lh3.googleusercontent.com/aida/AEtjO1X8USFIKLtpuzf_Mf8yk952qjIhesrdjKiMMQKhODGUv2-gpnt8-OQFb4dQVThPo6FOykEcHnAalKSQ4WlWR1CUtKOSmLwFUEQiuIEZ39bqnl6kFSZrfR2p9jjhEcILLE44FYWuoLOzKfNmTd87KfFsS115gWVrs_OuroAROxHF_mDCVYsRk_WHRbE6hvP8Oy5BICgsG4qJaQVStWZUFuIHEO3C4HW75BVr322M_SMkosM7hBXBOTejpxk" },
    @{ Name = "RakshaSetu_Master_Prompt_v2.md"; Url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBKOARIhYXBwX2NvbXBhbmlvbl91c2VyX3VwbG9hZGVkX2ZpbGVzGmkKM3VzZXJfdXBsb2FkZWRfaHRtbF8wMDA2NWFlMTMxYzI4ZDUzMDUwM2M3ZTQzZTAyZjY2YhILEgcQk9LlpqgOGAGSASQKCnByb2plY3RfaWQSFkIUMTQ1MjQ4OTI1ODAwMzcxMjAzODM&filename=&opi=89354086" },
    @{ Name = "Field_Responder_Tactical_Ops_HUD.html"; Url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWUxNWViZTkwMjgwNTc2MDJlNzQ2MDYyZWUzEgsSBxCT0uWmqA4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUyNDg5MjU4MDAzNzEyMDM4Mw&filename=&opi=89354086" },
    @{ Name = "Field_Responder_Tactical_Ops_HUD.png"; Url = "https://lh3.googleusercontent.com/aida/AEtjO1V5Xa9WDfgnW8nPHxH19PWRhY9rCU2_9ClyK4TsIP7zrJ_bkT3lpkrrI3QkuYQIhJ5T8US4tuEJ19b-Dxhbeb8i4n4R0XuyQlLIKcg2OZbVtcognc0eqckwccmh__yv4ojziU_YHmXil9v5miBpe0vDZevLB35iee46KxbE_loC4rWXkFWK1oz2FmsRXsrxcN5SSZQPjgpV6sBkkeqi6QyNcM0I8uxM0KAFOCm06urbwImlBxAuxfLbOas" },
    @{ Name = "RakshaSetu_Citizen_Emergency_Safety_App.html"; Url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWUxMjExMjI5YWViMDc2MDJlNzQ2MDYyZWUzEgsSBxCT0uWmqA4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUyNDg5MjU4MDAzNzEyMDM4Mw&filename=&opi=89354086" },
    @{ Name = "RakshaSetu_Citizen_Panel_Dashboard.html"; Url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWUxM2I4MDdmNGEwMTY5YTBjTQyZTZkMTU4YTE3EgsSBxCT0uWmqA4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUyNDg5MjU4MDAzNzEyMDM4Mw&filename=&opi=89354086" },
    @{ Name = "Admin_Platform_Control_Overview_Dashboard.html"; Url = "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY1YWUxNzU1ZDg3NzEwNTIyOTdhNzY0MTFhNzYxEgsSBxCT0uWmqA4YAZIBJAoKcHJvamVjdF9pZBIWQhQxNDUyNDg5MjU4MDAzNzEyMDM4Mw&filename=&opi=89354086" }
)

foreach ($asset in $Assets) {
    $FilePath = Join-Path -Path $TargetDir -ChildPath $asset.Name
    Write-Host "Downloading $($asset.Name) via curl -L ..."
    curl.exe -s -L $asset.Url -o $FilePath
    if (Test-Path $FilePath) {
        $Size = (Get-Item $FilePath).Length
        Write-Host "  Success: $($asset.Name) ($Size bytes)"
    } else {
        Write-Host "  Failed to download $($asset.Name)"
    }
}
