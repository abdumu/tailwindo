# Tailwindo

[![Latest Version on Packagist](https://img.shields.io/packagist/v/awssat/tailwindo.svg?style=flat-square)](https://packagist.org/packages/awssat/tailwindo)
[![Actions Status](https://github.com/awssat/tailwindo/workflows/Tests/badge.svg)](https://github.com/awssat/tailwindo/actions)


<p align="center">
  <img src="https://pbs.twimg.com/media/DQ-mDgSX0AUpCPL.png">
</p>

This tool can **convert Your CSS framework (currently Boostrap) classes** in HTML/PHP (any of your choice) files to equivalent **Tailwind CSS** classes.

## Features
- Made to be easy to add more CSS frameworks in the future (currently Bootstrap).
- Can convert single files/code snippets/folders.
- Can extract changes to a separate css file as Tailwind components and keep old classes names. like:
```
.p-md-5 {
	@apply md:p-7;
}
```

## Help Us
- If you find unexpected conversion result, create an issue; if you managed to fix it, please create a PR.
- If you are familiar with another CSS frameworks (like Foundation, Pure..), please create a PR and add it (see BootstrapFramework.php file).

## Docs
You can start reading Tailwindo's docs on our website [ [docs](https://awssat.com/opensource/tailwindo) ].
