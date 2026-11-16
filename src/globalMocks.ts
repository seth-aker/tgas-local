import { mimeTypeMock } from "./constants.js"

export type PartialDeep<T> =
  // If object is a function, return it as a function that returns a partialDeep object
  T extends (...args: infer Args) => infer Return
  ? (...args: Args) => PartialDeep<Return>
  // Handle Arrays
  : T extends (infer U)[]
  ? PartialDeep<U>[]
  // Handle BuiltIns (return them as if they are primitives)
  : T extends Date | RegExp | Map<any, any> | Set<any>
  ? T
  // Else return it as a PartialDeep object
  : T extends object
  ? {
    [P in keyof T]?: PartialDeep<T[P]>
  }
  : T

// Wrapping with PartialDeep allows one to mock only the elements that are neccessary. 
export interface IGlobalMocksObject {
  Adsense?: PartialDeep<GoogleAppsScript.Adsense>,
  AdminDirectory?: PartialDeep<GoogleAppsScript.AdminDirectory>,
  AdminGroupsMigration?: PartialDeep<GoogleAppsScript.AdminGroupsMigration>,
  AdminGroupsSettings?: PartialDeep<GoogleAppsScript.AdminGroupsSettings>,
  AdminLicenseManager?: PartialDeep<GoogleAppsScript.AdminLicenseManager>,
  AdminReports?: PartialDeep<GoogleAppsScript.AdminReports>,
  AdminReseller?: PartialDeep<GoogleAppsScript.AdminReseller>,
  BigQuery?: PartialDeep<GoogleAppsScript.BigQuery>,
  Browser?: PartialDeep<GoogleAppsScript.Base.Browser>,
  CacheService?: PartialDeep<GoogleAppsScript.Cache.CacheService>,
  Calendar?: PartialDeep<GoogleAppsScript.Calendar>,
  CalendarApp?: PartialDeep<GoogleAppsScript.Calendar.CalendarApp>,
  CardService?: PartialDeep<GoogleAppsScript.Card_Service.CardService>,
  Charts?: PartialDeep<GoogleAppsScript.Charts.Charts>,
  Classroom?: PartialDeep<GoogleAppsScript.Classroom>,
  ConferenceDataService?: PartialDeep<GoogleAppsScript.Conference_Data.ConferenceDataService>,
  console?: PartialDeep<Console>,
  Content?: PartialDeep<GoogleAppsScript.Content>,
  ContentService?: PartialDeep<GoogleAppsScript.Content.ContentService>,
  DataStudioApp?: PartialDeep<GoogleAppsScript.Data_Studio.DataStudioApp>,
  Dfareporting?: PartialDeep<GoogleAppsScript.Dfareporting>,
  Docs?: PartialDeep<GoogleAppsScript.Docs>,
  DocumentApp?: PartialDeep<GoogleAppsScript.Document.DocumentApp>,
  Drive?: PartialDeep<GoogleAppsScript.Drive>,
  Drive_v2?: PartialDeep<GoogleAppsScript.Drive_v2>,
  DriveActivity?: PartialDeep<GoogleAppsScript.DriveActivity>,
  DriveApp?: PartialDeep<GoogleAppsScript.Drive.DriveApp>,
  FormApp?: PartialDeep<GoogleAppsScript.Forms.FormApp>,
  Gmail?: PartialDeep<GoogleAppsScript.Gmail>,
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
  MimeType?: PartialDeep<GoogleAppsScript.Base.MimeType>,
  People?: PartialDeep<GoogleAppsScript.People>,
  PropertiesService?: PartialDeep<GoogleAppsScript.Properties.PropertiesService>,
  ScriptApp?: PartialDeep<GoogleAppsScript.Script.ScriptApp>,
  /** @deprecated Use {@link IGlobalMocksObject.PropertiesService} (`getScriptProperties()`) instead. */
  ScriptProperties?: PartialDeep<GoogleAppsScript.Properties.ScriptProperties>,
  Session?: PartialDeep<GoogleAppsScript.Base.Session>,
  Sheets?: PartialDeep<GoogleAppsScript.Sheets>,
  /** @deprecated SitesApp only worked with Classic Google Sites, which has been shut down. New Google Sites has no Apps Script service to replace it. */
  SitesApp?: PartialDeep<GoogleAppsScript.Sites.SitesApp>,
  Slides?: PartialDeep<GoogleAppsScript.Slides>,
  SlidesApp?: PartialDeep<GoogleAppsScript.Slides.SlidesApp>,
  SpreadsheetApp?: PartialDeep<GoogleAppsScript.Spreadsheet.SpreadsheetApp>,
  TagManager?: PartialDeep<GoogleAppsScript.TagManager>,
  Tasks?: PartialDeep<GoogleAppsScript.Tasks>,
  /** @deprecated UiApp has been shut down. Use {@link IGlobalMocksObject.HtmlService} for web apps and dialogs, or {@link IGlobalMocksObject.CardService} for add-ons, instead. */
  UiApp?: PartialDeep<Record<string, unknown>>,
  UrlFetchApp?: PartialDeep<GoogleAppsScript.URL_Fetch.UrlFetchApp>,
  /** @deprecated Use {@link IGlobalMocksObject.PropertiesService} (`getUserProperties()`) instead. */
  UserProperties?: PartialDeep<GoogleAppsScript.Properties.UserProperties>,
  Utilities?: PartialDeep<GoogleAppsScript.Utilities.Utilities>,
  XmlService?: PartialDeep<GoogleAppsScript.XML_Service.XmlService>,
  YouTube?: PartialDeep<GoogleAppsScript.YouTube>,
  YouTubeAnalytics?: PartialDeep<GoogleAppsScript.YouTubeAnalytics>,
  YoutubePartner?: PartialDeep<GoogleAppsScript.YoutubePartner>,
}

const loggerMock = {
  log: (data: any, ...values: any[]) => {
    console.log(data, ...values)
    return loggerMock
  },
  clear: () => loggerMock,
  getLog: () => ''
}

export const DEFAULT_GLOBAL_MOCKS: IGlobalMocksObject = {
  Logger: loggerMock,
  console: console,
  MimeType: mimeTypeMock,
}
