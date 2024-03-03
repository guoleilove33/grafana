import {locationService} from "@grafana/runtime";

import {getDashboardUrl} from "../dashboard-scene/utils/urlBuilders";

export function initIframeCommunication() {
  console.log("init")
  window.addEventListener('message', e => {
    if(e.data.title !== 'REQUEST_CHANGE_URL'){
      return
    }
    locationService.push(getDashboardUrl({
      uid: e.data.payload.uid,
      slug: e.data.payload.slug,
      currentQueryParams: e.data.payload.currentQueryParams
    }))
  })
  parent?.postMessage({
    title: 'INIT_COMPLETE'
  }, '*')
}
