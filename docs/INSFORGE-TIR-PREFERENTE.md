# Añadir columna TIR preferente en Insforge

Para que el campo **TIR preferente (%)** funcione en proyectos, hay que crear la columna en la tabla `proyectos` de Insforge.

## Opción 1: API (PATCH schema)

Si tienes acceso al API de Admin de Insforge (Bearer token o API Key), ejecuta:

```http
PATCH https://<TU_BASE_URL_INSFORGE>/api/database/tables/proyectos/schema
Content-Type: application/json

{
  "addColumns": [
    {
      "columnName": "tir_preferente",
      "type": "float",
      "isNullable": true
    }
  ]
}
```

Sustituye `<TU_BASE_URL_INSFORGE>` por la URL de tu proyecto (ej. `https://xxxx.eu-central.insforge.app`).

## Opción 2: Dashboard Insforge

1. Entra en [insforge.dev](https://insforge.dev) y abre tu proyecto.
2. Ve a **Database** → tabla **proyectos**.
3. Añade una columna:
   - **Nombre:** `tir_preferente`
   - **Tipo:** float / number
   - **Nullable:** sí

## Opción 3: MCP Insforge

Si usas el MCP de Insforge para administrar el backend, ejecuta la operación de actualización del schema de la tabla `proyectos` con:

- `addColumns`: `[{ "columnName": "tir_preferente", "type": "float", "isNullable": true }]`

---

Tras crear la columna, la app mostrará y guardará **TIR preferente** en la card del proyecto, en la vista detalle y en el formulario de crear/editar proyecto.
