const API_BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })

  if (response.status === 204) {
    return undefined as T
  }

  let data: Record<string, unknown>
  try {
    data = await response.json()
  } catch {
    throw new Error(
      `Erro inesperado do servidor (status ${response.status}). Verifique se o backend esta rodando em http://localhost:3000.`,
    )
  }

  if (!response.ok) {
    throw new Error(
      (data.message as string) ?? `Erro ao realizar operacao (status ${response.status}).`,
    )
  }

  return data as T
}

export const http = {
  get<T>(path: string): Promise<T> {
    return request<T>(path)
  },

  post<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  },

  put<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  },

  delete<T>(path: string): Promise<T> {
    return request<T>(path, {
      method: 'DELETE',
    })
  },
}
