<?php

function insertImports($filePath, $imports) {
    $content = file_get_contents($filePath);
    
    // Check if imports are already there
    $hasImports = true;
    foreach ($imports as $import) {
        if (strpos($content, $import) === false) {
            $hasImports = false;
            break;
        }
    }
    if ($hasImports) return;

    $importString = implode("\n", $imports) . "\n";
    $content = preg_replace('/use Filament\\\\Resources\\\\Resource;/', "use Filament\\Resources\\Resource;\n" . $importString, $content);
    file_put_contents($filePath, $content);
}

function updateMethod($filePath, $methodName, $newContent) {
    $content = file_get_contents($filePath);
    $pattern = '/public static function ' . $methodName . '\(.*?\): .*?\{.*?(return .*?;).*?\}/s';
    if (preg_match($pattern, $content, $matches)) {
        $content = preg_replace($pattern, 'public static function ' . $methodName . '( $1 ): $2 { ' . $newContent . ' }', $content); // simplified approach, just do str_replace of the return statement
    }
    
    // Safer approach: replace the return inside the method body.
    $pattern = '/(public static function ' . $methodName . '\(.*?\): [^{]+\{)(.*?)(    return)/s';
    
    // Instead of regex on body, let's just write exactly the methods since we know their initial state is empty array
    if ($methodName == 'form') {
        $content = preg_replace('/public static function form\(Form \$form\): Form\s*\{\s*return \$form\s*->schema\(\[\s*\/\/.*?\]\);\s*\}/s', "public static function form(Form \$form): Form\n    {\n        return \$form\n            ->schema([\n                " . $newContent . "\n            ]);\n    }", $content);
    } else if ($methodName == 'table') {
        $content = preg_replace('/public static function table\(Table \$table\): Table\s*\{\s*return \$table\s*->columns\(\[\s*\/\/.*?\]\)\s*->filters\(\[\s*\/\/.*?\]\)\s*->actions\(\[\s*Tables\\\\Actions\\\\EditAction::make\(\),\s*\]\)\s*->bulkActions\(\[\s*Tables\\\\Actions\\\\BulkActionGroup::make\(\[\s*Tables\\\\Actions\\\\DeleteBulkAction::make\(\),\s*\]\),\s*\]\);\s*\}/s', "public static function table(Table \$table): Table\n    {\n        return \$table\n            ->columns([\n                " . $newContent . "\n            ])\n            ->filters([\n                //\n            ])\n            ->actions([\n                Tables\Actions\EditAction::make(),\n            ])\n            ->bulkActions([\n                Tables\Actions\BulkActionGroup::make([\n                    Tables\Actions\DeleteBulkAction::make(),\n                ]),\n            ]);\n    }", $content);
    }

    file_put_contents($filePath, $content);
}


// ServiceResource
$file = 'app/Filament/Resources/ServiceResource.php';
insertImports($file, [
    "use Filament\\Forms\\Components\\TextInput;",
    "use Filament\\Forms\\Components\\Toggle;",
    "use Filament\\Forms\\Components\\TagsInput;",
    "use Filament\\Forms\\Components\\RichEditor;",
    "use Filament\\Tables\\Columns\\TextColumn;",
    "use Filament\\Tables\\Columns\\IconColumn;"
]);
updateMethod($file, 'form', "TextInput::make('title')->required()->maxLength(255), TextInput::make('icon')->maxLength(255), TagsInput::make('features')->separator(','), Toggle::make('is_popular')->default(false), TextInput::make('sort_order')->numeric()->default(0), Toggle::make('is_active')->default(true)");
updateMethod($file, 'table', "TextColumn::make('title')->searchable(), IconColumn::make('is_popular')->boolean(), TextColumn::make('sort_order')->sortable(), IconColumn::make('is_active')->boolean()");


// PortfolioResource
$file = 'app/Filament/Resources/PortfolioResource.php';
insertImports($file, [
    "use Filament\\Forms\\Components\\TextInput;",
    "use Filament\\Forms\\Components\\Toggle;",
    "use Filament\\Forms\\Components\\FileUpload;",
    "use Filament\\Tables\\Columns\\TextColumn;",
    "use Filament\\Tables\\Columns\\ImageColumn;",
    "use Filament\\Tables\\Columns\\IconColumn;"
]);
updateMethod($file, 'form', "TextInput::make('title')->required()->maxLength(255), TextInput::make('category')->required()->maxLength(255), FileUpload::make('image')->image()->directory('portfolios')->required(), TextInput::make('sort_order')->numeric()->default(0), Toggle::make('is_active')->default(true)");
updateMethod($file, 'table', "ImageColumn::make('image'), TextColumn::make('title')->searchable(), TextColumn::make('category')->searchable(), TextColumn::make('sort_order')->sortable(), IconColumn::make('is_active')->boolean()");

// TestimonialResource
$file = 'app/Filament/Resources/TestimonialResource.php';
insertImports($file, [
    "use Filament\\Forms\\Components\\TextInput;",
    "use Filament\\Forms\\Components\\Textarea;",
    "use Filament\\Forms\\Components\\Toggle;",
    "use Filament\\Forms\\Components\\FileUpload;",
    "use Filament\\Tables\\Columns\\TextColumn;",
    "use Filament\\Tables\\Columns\\ImageColumn;",
    "use Filament\\Tables\\Columns\\IconColumn;"
]);
updateMethod($file, 'form', "TextInput::make('client_name')->required()->maxLength(255), TextInput::make('role')->maxLength(255), Textarea::make('content')->required(), FileUpload::make('avatar')->image()->directory('avatars'), TextInput::make('sort_order')->numeric()->default(0), Toggle::make('is_active')->default(true)");
updateMethod($file, 'table', "ImageColumn::make('avatar'), TextColumn::make('client_name')->searchable(), TextColumn::make('role'), TextColumn::make('sort_order')->sortable(), IconColumn::make('is_active')->boolean()");


// HeroSlideResource
$file = 'app/Filament/Resources/HeroSlideResource.php';
insertImports($file, [
    "use Filament\\Forms\\Components\\TextInput;",
    "use Filament\\Forms\\Components\\Toggle;",
    "use Filament\\Forms\\Components\\FileUpload;",
    "use Filament\\Tables\\Columns\\TextColumn;",
    "use Filament\\Tables\\Columns\\ImageColumn;",
    "use Filament\\Tables\\Columns\\IconColumn;"
]);
updateMethod($file, 'form', "TextInput::make('title')->required()->maxLength(255), FileUpload::make('image')->image()->directory('heroes')->required(), TextInput::make('sort_order')->numeric()->default(0), Toggle::make('is_active')->default(true)");
updateMethod($file, 'table', "ImageColumn::make('image'), TextColumn::make('title')->searchable(), TextColumn::make('sort_order')->sortable(), IconColumn::make('is_active')->boolean()");

echo "Filament resources updated.";
