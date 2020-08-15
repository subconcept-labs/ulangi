function logOut(): void {
  PropertiesService.getDocumentProperties().deleteProperty("apiKey")
}
