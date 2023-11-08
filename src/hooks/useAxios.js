import { ref, watchEffect, toValue } from 'vue'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api'
})

axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'
axiosInstance.defaults.withCredentials = true

export function useAxios({ url, method = 'get', body = {} }) {
    const resp = ref(null)
    const error = ref(null)
    const isLoading = ref(null)

    watchEffect(async () => {
        const urlValue = toValue(url)
        const methodValue = toValue(method)
        const bodyValue = toValue(body)

        if (!urlValue) return { resp, error, isLoading }

        resp.value = null
        error.value = null
        isLoading.value = true

        try {
            resp.value = await axiosInstance({ url: urlValue, method: methodValue, data: bodyValue })
            isLoading.value = false
        } catch (e) {
            error.value = e
            isLoading.value = false
        }
    })

  return { resp, error, isLoading }
}
