export type PartialDeep<T> = 
// If object is a function, return it as a function that returns a partialDeep object
T extends (...args: infer Args) => infer Return 
  ? (...args: Args) => PartialDeep<Return>
// Handle Arrays
  : T extends (infer U)[] 
    ? PartialDeep<U>[] 
// Handle BuiltIns (return them as if they are primitives)
  : T extends Date | RegExp | Map<any,any> | Set<any> 
    ? T
// Else return it as a PartialDeep object
  : T extends object 
    ? {
      [P in keyof T]?: PartialDeep<T[P]>
    } 
  : T

// Wrapping with PartialDeep allows one to mock only the elements that are neccessary. 
export interface IGlobalMocksObject {
  AdSense?: PartialDeep<GoogleAppsScript.Adsense>,
  AdminDirectory?: PartialDeep<GoogleAppsScript.AdminDirectory>,
  AdminGroupsMigration?: PartialDeep<GoogleAppsScript.AdminGroupsMigration>,
  AdminGroupsSettings?: PartialDeep<GoogleAppsScript.AdminGroupsSettings>,
  AdminLicenseManager?: PartialDeep<GoogleAppsScript.AdminLicenseManager>,
  AdminReports?: PartialDeep<GoogleAppsScript.AdminReports>,
  AdminReseller?: PartialDeep<GoogleAppsScript.AdminReseller>,
  Analytics?: PartialDeep<GoogleAppsScript.Analytics>,
  AnalyticsReporting?: PartialDeep<GoogleAppsScript.AnalyticsReporting>,
  AppsActivity?: PartialDeep<GoogleAppsScript.Appsactivity>,
  BigQuery?: PartialDeep<GoogleAppsScript.BigQuery>,
  Browser?: PartialDeep<GoogleAppsScript.Base.Browser>,
  CacheService?: PartialDeep<GoogleAppsScript.Cache.CacheService>,
  Calendar?: PartialDeep<GoogleAppsScript.Calendar.Calendar>,
  CalendarApp?: PartialDeep<GoogleAppsScript.Calendar.CalendarApp>,
  CardService?: PartialDeep<GoogleAppsScript.Card_Service.CardService>,
  Charts?: PartialDeep<GoogleAppsScript.Charts.Charts>,
  Classroom?: PartialDeep<GoogleAppsScript.Classroom>,
  ConferenceDataService?: PartialDeep<GoogleAppsScript.Conference_Data.ConferenceDataService>,
  ContactsApp?: PartialDeep<GoogleAppsScript.Contacts.ContactsApp>,
  ContentService?: PartialDeep<GoogleAppsScript.Content.ContentService>,
  DataStudioApp?: PartialDeep<GoogleAppsScript.Data_Studio.DataStudioApp>,
  Docs?: PartialDeep<GoogleAppsScript.Docs>,
  DocumentApp?: PartialDeep<GoogleAppsScript.Document.DocumentApp>,
  Drive?: PartialDeep<GoogleAppsScript.Drive>,
  DriveActivity?: PartialDeep<GoogleAppsScript.DriveActivity>,
  DriveApp?: PartialDeep<GoogleAppsScript.Drive.DriveApp>,
  FormApp?: PartialDeep<GoogleAppsScript.Forms.FormApp>,
  GmailApp?: PartialDeep<GoogleAppsScript.Gmail.GmailApp>,
  GroupsApp?: PartialDeep<GoogleAppsScript.Groups.GroupsApp>,
  HtmlService?: PartialDeep<GoogleAppsScript.HTML.HtmlService>,
  Jdbc?: PartialDeep<GoogleAppsScript.JDBC.Jdbc>,
  LanguageApp?: PartialDeep<GoogleAppsScript.Language.LanguageApp>,
  LinearOptimizationService?: PartialDeep<GoogleAppsScript.Optimization.LinearOptimizationService>,
  LockService?: PartialDeep<GoogleAppsScript.Lock.LockService>,
  Logger?: PartialDeep<GoogleAppsScript.Base.Logger>,
  MailApp?: PartialDeep<GoogleAppsScript.Mail.MailApp>,
  Maps?: PartialDeep<GoogleAppsScript.Maps.Maps>,
  Mirror?: PartialDeep<GoogleAppsScript.Mirror>,
  People?: PartialDeep<GoogleAppsScript.People>,
  PropertiesService?: PartialDeep<GoogleAppsScript.Properties.PropertiesService>,
  ScriptApp?: PartialDeep<GoogleAppsScript.Script.ScriptApp>,
  Session?: PartialDeep<GoogleAppsScript.Base.Session>,
  Sheets?: PartialDeep<GoogleAppsScript.Sheets>,
  SitesApp?: PartialDeep<GoogleAppsScript.Sites.SitesApp>,
  Slides?: PartialDeep<GoogleAppsScript.Slides>,
  SlidesApp?: PartialDeep<GoogleAppsScript.Slides.SlidesApp>,
  SpreadsheetApp?: PartialDeep<GoogleAppsScript.Spreadsheet.SpreadsheetApp>,
  TagManager?: PartialDeep<GoogleAppsScript.TagManager>,
  Tasks?: PartialDeep<GoogleAppsScript.Tasks>,
  UrlFetchApp?: PartialDeep<GoogleAppsScript.URL_Fetch.UrlFetchApp>,
  Utilities?: PartialDeep<GoogleAppsScript.Utilities.Utilities>,
  XmlService?: PartialDeep<GoogleAppsScript.XML_Service.XmlService>,
  YouTube?: PartialDeep<GoogleAppsScript.YouTube>,
  YouTubeAnalytics?: PartialDeep<GoogleAppsScript.YouTubeAnalytics>,
}
export const DEFAULT_GLOBAL_MOCKS: IGlobalMocksObject = {
  Logger: {
    log: (data: any) => {
      console.log(data)
      return Logger
    },
    clear: () => undefined,
    getLog: () => ''
  }
}
