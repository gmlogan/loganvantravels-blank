---
title: "{{ replace .File.ContentBaseName `-` ` ` | title }}"
date: {{ now.Format "2006-01-02" }}
draft: false
slug: "{{ .File.ContentBaseName }}"
wp_published: {{ now.Format "2006-01-02" }}
---

