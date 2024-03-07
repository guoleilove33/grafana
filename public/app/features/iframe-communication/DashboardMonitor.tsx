import {useEffect} from "react";
import {useLocation} from "react-router-dom";

import {locationService} from "@grafana/runtime";

import {useGrafana} from "../../core/context/GrafanaContext";
import {getDashboardUrl} from "../dashboard-scene/utils/urlBuilders";

export function useDashboardMonitor(routerName?: string, uid?: string, slug?: string) {
  const {chrome, location} = useGrafana()
  const loc = useLocation()
  useEffect(() => {
    const kioskModeChangeHandler = (e: any) => {
      if (e.data.title !== 'REQUEST_CHANGE_KIOSK') {
        return
      }
      location.partial({kiosk: e.data.payload})
      chrome.setKioskModeFromUrl(String(e.data.payload))
    }
    const dashboardChangeHandler = (e: any) => {
      if (e.data.title !== 'REQUEST_CHANGE_DASHBOARD') {
        return
      }
      locationService.push(getDashboardUrl({
        uid: e.data.payload.uid,
        slug: e.data.payload.slug,
        updateQuery: {
          ...e.data.payload.query,
          kiosk: location.getSearchObject()["kiosk"] ?? '0'
        },
        currentQueryParams: ''
      }))
    }
    const paramChangeHandler = (e: any) => {
      if (e.data.title !== 'REQUEST_CHANGE_PARAMS') {
        return
      }
      locationService.partial(e.data.payload)
    }
    window.addEventListener('message', dashboardChangeHandler)
    window.addEventListener('message', paramChangeHandler)
    window.addEventListener('message', kioskModeChangeHandler)
    if (parent) {
      parent.postMessage({
        title: 'LIFETIME',
        payload: {
          status: 'Start'
        }
      }, '*')
    }
    return () => {
      if (parent) {
        parent.postMessage({
          title: 'LIFETIME',
          payload: 'End'
        }, '*')
      }
      window.removeEventListener('message', dashboardChangeHandler)
      window.removeEventListener('message', paramChangeHandler)
      window.removeEventListener('message', kioskModeChangeHandler)
    }
  }, [chrome, location])
  useEffect(() => {
    if (parent) {
      parent.postMessage({
        title: 'DASHBOARD_CHANGED',
        payload: {
          uid, slug, routerName, query: location.getSearchObject()
        }
      }, '*')
    }
  }, [routerName, uid, slug, location, loc.search])
}
