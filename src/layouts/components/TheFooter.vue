<template functional>
    <footer class="the-footer flex-wrap justify-between" :class="classes">
        <p>
          <span>&copy;</span>
          <span>{{ new Date().getFullYear() }} </span>
          <a href="https://www.gob.pe/regioncusco" target="_blank" rel="nofollow">Gobierno Regional de Cusco.</a>
          <span class="hidden sm:inline-block">, todos los derechos reservados.</span>
        </p>
        <span class="md:flex hidden items-center">
            <span>Versión 1.0.0</span>
        </span>
    </footer>
</template>

<script>

export default {
    name: "the-footer",
    props: {
        classes: { type: String, },
    },
}
</script>
