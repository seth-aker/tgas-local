/// <reference types="google-apps-script" />

export interface IGlobalMocksObject {
  AdSense?: GoogleAppsScript.Adsense,
  AdminDirectory?: GoogleAppsScript.AdminDirectory,
  AdminGroupsMigration?: GoogleAppsScript.AdminGroupsMigration,
  AdminGroupsSettings?: GoogleAppsScript.AdminGroupsSettings,
  AdminLicenseManager?: GoogleAppsScript.AdminLicenseManager,
  AdminReports?: GoogleAppsScript.AdminReports,
  AdminReseller?: GoogleAppsScript.AdminReseller,
  Analytics?: GoogleAppsScript.Analytics,
  AnalyticsReporting?: GoogleAppsScript.AnalyticsReporting,
  AppsActivity?: GoogleAppsScript.Appsactivity,
  BigQuery?: GoogleAppsScript.BigQuery,
  Browser?: GoogleAppsScript.Base.Browser,
  CacheService?: GoogleAppsScript.Cache.CacheService,
  Calendar?: GoogleAppsScript.Calendar.Calendar
  CalendarApp?: GoogleAppsScript.Calendar.CalendarApp,
  CardService?: GoogleAppsScript.Card_Service.CardService,
  Charts?: GoogleAppsScript.Charts.Charts,
  Classroom?: GoogleAppsScript.Classroom,
  ConferenceDataService?: GoogleAppsScript.Conference_Data.ConferenceDataService,
  ContactsApp?: GoogleAppsScript.Contacts.ContactsApp,
  ContentService?: GoogleAppsScript.Content.ContentService,
  DataStudioApp?: GoogleAppsScript.Data_Studio.DataStudioApp,
  Docs?: GoogleAppsScript.Docs
  DocumentApp?: GoogleAppsScript.Document.DocumentApp,
  Drive?: GoogleAppsScript.Drive
  DriveActivity?: GoogleAppsScript.DriveActivity
  DriveApp?: GoogleAppsScript.Drive.DriveApp,
  FormApp?: GoogleAppsScript.Forms.FormApp,
  GmailApp?: GoogleAppsScript.Gmail.GmailApp,
  GroupsApp?: GoogleAppsScript.Groups.GroupsApp,
  HtmlService?: GoogleAppsScript.HTML.HtmlService,
  Jdbc?: GoogleAppsScript.JDBC.Jdbc,
  LanguageApp?: GoogleAppsScript.Language.LanguageApp,
  LinearOptimizationService?: GoogleAppsScript.Optimization.LinearOptimizationService,
  LockService?: GoogleAppsScript.Lock.LockService,
  Logger?: GoogleAppsScript.Base.Logger,
  MailApp?: GoogleAppsScript.Mail.MailApp,
  Maps?: GoogleAppsScript.Maps.Maps,
  Mirror?: GoogleAppsScript.Mirror
  People?: GoogleAppsScript.People
  PropertiesService?: GoogleAppsScript.Properties.PropertiesService,
  ScriptApp?: GoogleAppsScript.Script.ScriptApp,
  Session?: GoogleAppsScript.Base.Session,
  Sheets?: GoogleAppsScript.Sheets,
  SitesApp?: GoogleAppsScript.Sites.SitesApp,
  Slides?: GoogleAppsScript.Slides
  SlidesApp?: GoogleAppsScript.Slides.SlidesApp,
  SpreadsheetApp?: GoogleAppsScript.Spreadsheet.SpreadsheetApp,
  TagManager?: GoogleAppsScript.TagManager,
  Tasks?: GoogleAppsScript.Tasks,
  UrlFetchApp?: GoogleAppsScript.URL_Fetch.UrlFetchApp,
  Utilities?: GoogleAppsScript.Utilities.Utilities,
  XmlService?: GoogleAppsScript.XML_Service.XmlService,
  YouTube?: GoogleAppsScript.YouTube,
  YouTubeAnalytics?: GoogleAppsScript.YouTubeAnalytics,
}
export const DefaultGlobalMocks: IGlobalMocksObject = {
  Logger: {
    log: (data: any) => {
      console.log(data)
      return Logger
    },
    clear: () => undefined,
    getLog: () => ''
  }
}
